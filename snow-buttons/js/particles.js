export default class Particles {
  constructor(three, button) {
    this.three = three;
    this.button = button;

    this.count = 360;

    this.halfW = button.width * 0.43;
    this.halfH = button.height * 0.38;

    this.geometry = new three.SphereGeometry(0.5, 12, 8);

    this.material = new three.MeshStandardMaterial({
      color: 0xffffff,//button.config.particle,
      emissive: 0xffffff,//button.config.particle,
      emissiveIntensity: 1,
      //transparent: true,
      //opacity:0.985,
      roughness: 0.72,
      metalness: 0.8
    });

    this.fireflies = [];

    for (let i = 0; i < this.count; i++) {
      const firefly = new three.Mesh(
        this.geometry,
        this.material
      );

      firefly.position.set(
        (Math.random() * 2 - 1) * this.halfW,
        (Math.random() * 2 - 1) * this.halfH,
        (Math.random() * 2 - 1) * 10
      );

      const scale =
        0.5 + Math.random() * 0.8;

      firefly.scale.setScalar(scale);

      firefly.userData.vx =
        (Math.random() - 0.5) * 0.2;

      firefly.userData.vy =
        (Math.random() - 0.5) * 0.2;

      firefly.userData.vz =
        (Math.random() - 0.5) * 0.08;

      firefly.userData.phase =
        Math.random() * Math.PI * 2;

      this.fireflies.push(firefly);
    }
  }

  init() {
    const group = new this.three.Group();

    for (const firefly of this.fireflies) {
      group.add(firefly);
    }

    return group;
  }

  update(dt, elapsed) {
    for (const firefly of this.fireflies) {
      const data = firefly.userData;

      /*
       * Very gentle wandering.
       */
      data.vx +=
        Math.sin(
          elapsed * 0.4 + data.phase
        ) * 0.002;

      data.vy +=
        Math.cos(
          elapsed * 0.35 + data.phase
        ) * 0.002;

      data.vz +=
        Math.sin(
          elapsed * 0.25 + data.phase
        ) * 0.0005;

      /*
       * Keep the motion slow.
       */
      data.vx *= 0.995;
      data.vy *= 0.995;
      data.vz *= 0.995;

      firefly.position.x +=
        data.vx * dt * 60;

      firefly.position.y +=
        data.vy * dt * 60;

      firefly.position.z +=
        data.vz * dt * 60;

      /*
       * Keep them inside the capsule-ish area.
       */
      const x =
        firefly.position.x / this.halfW;

      const y =
        firefly.position.y / this.halfH;

      const distance =
        x * x + y * y;

      if (distance > 1) {
        firefly.position.x *= 0.98;
        firefly.position.y *= 0.98;

        data.vx *= -0.7;
        data.vy *= -0.7;
      }

      /*
       * Keep them within the glass depth.
       */
      if (firefly.position.z > 10) {
        firefly.position.z = 10;
        data.vz *= -1;
      }

      if (firefly.position.z < -10) {
        firefly.position.z = -10;
        data.vz *= -1;
      }
    }
  }
}

/*export default class Particles {
    constructor(three, button) {
      this.config = button.config;
      this.count = button.config.density;

      this.positions = new Float32Array(this.count * 3);
      this.velocities = new Float32Array(this.count * 3);
      this.sizes = new Float32Array(this.count);
      this.random = new Float32Array(this.count);

      const halfW = button.width * 0.47;
      const halfH = button.height * 0.43;

      for ( let i = 0; i < this.count; i++ ) {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.sqrt(Math.random());


        this.positions[i * 3] = Math.cos(angle) * radius * halfW;

        this.positions[i * 3 + 1] = Math.sin(angle) * radius * halfH;

        this.positions[i * 3 + 2] = (Math.random() - 0.5) * 4;

        this.velocities[i * 3] = (Math.random() - 0.5) * 0.15;

        this.velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.15;

        this.velocities[i * 3 + 2] = 0;


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


            float core = smoothstep(0.22, 0.0, d);

            vec3 finalColor =color * (0.65 + core * 0.8);

            gl_FragColor = vec4(finalColor, alpha * 0.72);
          }
        `
      });
    }
    init(three) {
      return new three.Points(
        this.geometry,
        this.material
      );      
    }
    update(dt, elapsed, button) {

      button.hover += (button.hoverTarget - button.hover) * Math.min(dt * 5, 1);

      button.mouse.lerp(button.mouseTarget, Math.min(dt * 8, 1));


      const cursorStrength = button.hover * 0.015;

      const halfW = button.width * 0.47;

      const halfH = button.height * 0.43;

      const count = this.config.density;      
      for (let i = 0; i < this.count; i++) {
        const ix = i * 3;

        let x = this.positions[ix];
        let y = this.positions[ix + 1];

        let vx = this.velocities[ix];
        let vy = this.velocities[ix + 1];


        const phase = elapsed * (0.35 + this.random[i] * 0.3) + this.random[i] * 30;

        vx +=
          (
            Math.sin(phase + y * 0.025) +
            Math.sin(phase * 1.73 + x * 0.018) * 0.45
          ) *
          this.config.turbulence * dt;

        vy +=
          (
            Math.cos(phase * 0.87 + x * 0.02) +
            Math.sin(phase * 1.37 + y * 0.021) * 0.4
          ) *
          this.config.turbulence * dt;


        if ( this.hover > 0.01 ) {
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


        const damping = Math.pow(0.035, dt);

        vx *= damping;
        vy *= damping;


        x += vx * dt * 60 * this.config.speed;

        y += vy * dt * 60 * this.config.speed;


        const nx = x / halfW;
        const ny = y / halfH;
        const distance = nx * nx + ny * ny;

        if ( distance > 1 ) {
          const scale = 0.985 / Math.sqrt(distance);

          x *= scale;
          y *= scale;


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

      this.material.uniforms.hover.value = button.hover;
    }
}*/
