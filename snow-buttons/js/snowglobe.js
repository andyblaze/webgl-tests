import Background from "./b-ground.js";
import Rim from "./rim.js";
import Glass from "./glass.js";

class Particles {
      constructor(three, button) {
      const count = button.config.density;

      this.positions = new Float32Array(count * 3);
      this.velocities = new Float32Array(count * 3);
      this.sizes = new Float32Array(count);
      this.random = new Float32Array(count);

      const halfW = button.width * 0.47;
      const halfH = button.height * 0.43;

      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.sqrt(Math.random());

        /*
         * Start particles inside an ellipse. The capsule boundary
         * collision below keeps them inside the actual rounded shape.
         */
        this.positions[i * 3] = Math.cos(angle) * radius * halfW;

        this.positions[i * 3 + 1] = Math.sin(angle) * radius * halfH;

        this.positions[i * 3 + 2] = (Math.random() - 0.5) * 4;

        this.velocities[i * 3] = (Math.random() - 0.5) * 0.15;

        this.velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.15;

        this.velocities[i * 3 + 2] = 0;

        /*
         * Most particles are tiny, with occasional larger particles.
         */
        const sizeRoll = Math.random();

        if (sizeRoll < 0.88) {
          this.sizes[i] = 0.7 + Math.random() * 1.4;
        } else {
          this.sizes[i] = 1.8 + Math.random() * 2.2;
        }

        this.random[i] = Math.random();
      }

      this.geometry = new three.BufferGeometry();

      this.geometry.setAttribute(
        "position",
        new three.BufferAttribute(
          this.positions,
          3
        )
      );

      this.geometry.setAttribute(
        "size",
        new three.BufferAttribute(
          this.sizes,
          1
        )
      );

      this.material = new three.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: three.AdditiveBlending,

        uniforms: {
          color: {
            value: new three.Color(
              button.config.particle
            )
          },

          pixelRatio: {
            value: Math.min(
              window.devicePixelRatio,
              2
            )
          },

          hover: {
            value: 0
          }
        },

        vertexShader: `
          attribute float size;

          uniform float pixelRatio;

          varying float vDepth;

          void main() {
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

            vDepth = position.z;

            gl_PointSize = size * pixelRatio * (1.0 + position.z * 0.08);

            gl_Position = projectionMatrix * mvPosition;
          }
        `,

        fragmentShader: `
          uniform vec3 color;

          varying float vDepth;

          void main() {
            vec2 uv = gl_PointCoord - vec2(0.5);

            float d = length(uv);

            float alpha = smoothstep(0.5, 0.0, d);

            /*
             * Soft particle with a slightly brighter centre.
             */
            float core = smoothstep(0.22, 0.0, d);

            vec3 finalColor =color * (0.65 + core * 0.8);

            gl_FragColor = vec4(finalColor, alpha * 0.72);
          }
        `
      });

      this.points = new three.Points(
        this.geometry,
        this.material
      );      
    }
  }


export default class Snowglobe {
    constructor(three, element, configs) {
      this.element = element;

      const key = element.dataset.color;
      this.config = configs[key];

      this.width = element.clientWidth;
      this.height = element.clientHeight;

      this.scene = new three.Scene();

      const halfW = this.width / 2;
      const halfH = this.height / 2;

      this.camera = new three.OrthographicCamera(-halfW, halfW, halfH, -halfH, -100, 100);
      this.camera.position.z = 10;

      this.renderer = new three.WebGLRenderer({ alpha: true, antialias: true });
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      this.renderer.setSize(this.width, this.height, false);
      this.renderer.outputColorSpace = three.SRGBColorSpace;

      element.insertBefore(this.renderer.domElement, element.firstChild);

      this.group = new three.Group();
      this.scene.add(this.group);

      this.mouse = new three.Vector2(9999, 9999);
      this.mouseTarget = new three.Vector2(9999, 9999);

      this.hover = 0;
      this.hoverTarget = 0;

      const bgMesh = Background.create(three, this);
      bgMesh.position.z = -2;
      this.group.add(bgMesh);
      this.background = bgMesh;

      this.particles = this.createParticles(three);
      this.group.add(this.particles);

      this.glass = Glass.create(three, this);
      this.glass.position.z = 3;
      this.group.add(this.glass);

      this.rim = Rim.create(three, this);
      this.group.add(this.rim);

      this.bindEvents();
    }
    createParticles(three) {
      const count = this.config.density;

      this.positions = new Float32Array(count * 3);
      this.velocities = new Float32Array(count * 3);
      this.sizes = new Float32Array(count);
      this.random = new Float32Array(count);

      const halfW = this.width * 0.47;
      const halfH = this.height * 0.43;

      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.sqrt(Math.random());

        /*
         * Start particles inside an ellipse. The capsule boundary
         * collision below keeps them inside the actual rounded shape.
         */
        this.positions[i * 3] =
          Math.cos(angle) * radius * halfW;

        this.positions[i * 3 + 1] =
          Math.sin(angle) * radius * halfH;

        this.positions[i * 3 + 2] =
          (Math.random() - 0.5) * 4;

        this.velocities[i * 3] =
          (Math.random() - 0.5) * 0.15;

        this.velocities[i * 3 + 1] =
          (Math.random() - 0.5) * 0.15;

        this.velocities[i * 3 + 2] = 0;

        /*
         * Most particles are tiny, with occasional larger particles.
         */
        const sizeRoll = Math.random();

        if (sizeRoll < 0.88) {
          this.sizes[i] =
            0.7 + Math.random() * 1.4;
        } else {
          this.sizes[i] =
            1.8 + Math.random() * 2.2;
        }

        this.random[i] = Math.random();
      }

      this.geometry = new three.BufferGeometry();

      this.geometry.setAttribute(
        "position",
        new three.BufferAttribute(
          this.positions,
          3
        )
      );

      this.geometry.setAttribute(
        "size",
        new three.BufferAttribute(
          this.sizes,
          1
        )
      );

      const material = new three.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: three.AdditiveBlending,

        uniforms: {
          color: {
            value: new three.Color(
              this.config.particle
            )
          },

          pixelRatio: {
            value: Math.min(
              window.devicePixelRatio,
              2
            )
          },

          hover: {
            value: 0
          }
        },

        vertexShader: `
          attribute float size;

          uniform float pixelRatio;

          varying float vDepth;

          void main() {
            vec4 mvPosition =
              modelViewMatrix * vec4(position, 1.0);

            vDepth = position.z;

            gl_PointSize =
              size *
              pixelRatio *
              (1.0 + position.z * 0.08);

            gl_Position =
              projectionMatrix *
              mvPosition;
          }
        `,

        fragmentShader: `
          uniform vec3 color;

          varying float vDepth;

          void main() {
            vec2 uv =
              gl_PointCoord - vec2(0.5);

            float d =
              length(uv);

            float alpha =
              smoothstep(
                0.5,
                0.0,
                d
              );

            /*
             * Soft particle with a slightly brighter centre.
             */
            float core =
              smoothstep(
                0.22,
                0.0,
                d
              );

            vec3 finalColor =
              color * (0.65 + core * 0.8);

            gl_FragColor =
              vec4(
                finalColor,
                alpha * 0.72
              );
          }
        `
      });

      return new three.Points(
        this.geometry,
        material
      );      
    }
    bindEvents() {
      this.element.addEventListener(
        "pointerenter",
        () => {
          this.hoverTarget = 1;
        }
      );

      this.element.addEventListener(
        "pointerleave",
        () => {
          this.hoverTarget = 0;

          this.mouseTarget.set(
            9999,
            9999
          );
        }
      );

      this.element.addEventListener(
        "pointermove",
        event => {
          const rect = this.element.getBoundingClientRect();

          this.mouseTarget.set(
            event.clientX - rect.left - rect.width / 2,
            -(event.clientY - rect.top - rect.height / 2)
          );
        }
      );
    }

    update(dt, elapsed) {
      /*
       * Smooth hover state.
       */
      this.hover += (this.hoverTarget - this.hover) * Math.min(dt * 5, 1);

      this.mouse.lerp(this.mouseTarget, Math.min(dt * 8, 1));

      /*
       * Cursor influence becomes stronger on hover.
       */
      const cursorStrength = this.hover * 0.015;

      const halfW = this.width * 0.47;

      const halfH = this.height * 0.43;

      const count = this.config.density;

      for (let i = 0; i < count; i++) {
        const ix = i * 3;

        let x = this.positions[ix];
        let y = this.positions[ix + 1];

        let vx = this.velocities[ix];
        let vy = this.velocities[ix + 1];

        /*
         * Very gentle Brownian-like acceleration.
         *
         * Multiple sine waves stop the movement from looking like
         * independent random jitter.
         */
        const phase = elapsed * (0.35 + this.random[i] * 0.3) + this.random[i] * 30;

        vx +=
          (
            Math.sin(phase + y * 0.025) +
            Math.sin(phase * 1.73 + x * 0.018) * 0.45
          ) *
          this.config.turbulence *dt;

        vy +=
          (
            Math.cos(phase * 0.87 + x * 0.02) +
            Math.sin(phase * 1.37 + y * 0.021) * 0.4
          ) *
          this.config.turbulence * dt;

        /*
         * Cursor pushes particles away.
         */
        if (this.hover > 0.01) {
          const dx = x - this.mouse.x;

          const dy = y - this.mouse.y;

          const distSq = dx * dx + dy * dy;

          const influenceRadius = 70;

          if ( distSq < influenceRadius * influenceRadius ) {
            const dist = Math.sqrt(Math.max(distSq, 0.001));
            const force = (1 - dist / influenceRadius) * cursorStrength;

            vx += (dx / dist) * force;

            vy += (dy / dist) * force;
          }
        }

        /*
         * Damping.
         */
        const damping = Math.pow(0.035, dt);

        vx *= damping;
        vy *= damping;

        /*
         * A tiny amount of velocity gives the particles
         * a sense of inertia.
         */
        x += vx * dt * 60 * this.config.speed;

        y += vy * dt * 60 * this.config.speed;

        /*
         * Soft capsule boundary.
         *
         * We use an ellipse approximation here because it is
         * visually sufficient at this scale.
         */
        const nx = x / halfW;

        const ny = y / halfH;

        const distance = nx * nx + ny * ny;

        if ( distance > 1 ) {
          const scale = 0.985 / Math.sqrt(distance);

          x *= scale;
          y *= scale;

          /*
           * Reflect only the velocity component pointing
           * outward, then damp it heavily.
           */
          const normalX = x / (halfW * halfW);
          const normalY = y / (halfH * halfH);

          const length = Math.sqrt(normalX * normalX + normalY * normalY);

          const nx2 = normalX / length;
          const ny2 = normalY / length;
          const outward = vx * nx2 + vy * ny2;

          if ( outward > 0 ) {
            vx -= outward * nx2 * 1.7;
            vy -= outward * ny2 * 1.7;
          }

          vx *= 0.45;
          vy *= 0.45;
        }

        this.positions[ix] = x;
        this.positions[ix + 1] = y;

        this.velocities[ix] = vx;
        this.velocities[ix + 1] = vy;
      }

      this.geometry.attributes.position.needsUpdate = true;

      this.particles.material.uniforms.hover.value = this.hover;

      this.glass.material.uniforms.hover.value = this.hover;

      /*
       * Very slight breathing of the whole glass.
       */
      const scale =
        1 +
        Math.sin(elapsed * 0.7) *
        0.002 +
        this.hover *
        0.006;

      this.group.scale.set(scale, scale, 1);

      this.renderer.render(this.scene, this.camera);
    }

    resize() {
      this.width = this.element.clientWidth;

      this.height = this.element.clientHeight;

      this.camera.left = -this.width / 2;

      this.camera.right = this.width / 2;

      this.camera.top = this.height / 2;

      this.camera.bottom = -this.height / 2;

      this.camera.updateProjectionMatrix();

      this.renderer.setSize(this.width, this.height, false);
    }
  }