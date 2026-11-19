
import * as THREE from 'three';

export class ParticleEngine {
    constructor(scene, options = {}) {
        this.scene = scene;

        this.count = options.count ?? 5000;
        this.innerRadius = options.innerRadius ?? 2.5;
        this.outerRadius = options.outerRadius ?? 5.6;

        this.time = 0;
        this.energy = 0.65;

        this.uniforms = {
            uTime: { value: 0 },
            uEnergy: { value: this.energy }
        };

        this.group = new THREE.Group();

        this.createParticles();

        this.scene.add(this.group);
    }

    createParticles() {
        const geometry = new THREE.BufferGeometry();

        const radii = new Float32Array(this.count);
        const angles = new Float32Array(this.count);
        const inclinations = new Float32Array(this.count);
        const speeds = new Float32Array(this.count);
        const sizes = new Float32Array(this.count);
        const phases = new Float32Array(this.count);
        const colors = new Float32Array(this.count * 3);
        const brightness = new Float32Array(this.count);

        const palette = [
            new THREE.Color(0x00eaff),
            new THREE.Color(0x347bff),
            new THREE.Color(0x914bff),
            new THREE.Color(0xff36c7),
            new THREE.Color(0xff8b43),
            new THREE.Color(0xc3a0ff)
        ];

        const streamCount = 6;

        for (let i = 0; i < this.count; i++) {
            const i3 = i * 3;

            // Assign each particle to an orbital stream
            const stream = Math.floor(
                Math.random() * streamCount
            );

            const streamPosition =
                stream / (streamCount - 1);

            const streamRadius = THREE.MathUtils.lerp(
                this.innerRadius,
                this.outerRadius,
                streamPosition
            );

            // Each stream has a slightly different width
            radii[i] = streamRadius +
                (Math.random() - 0.5) * 0.55;

            angles[i] = Math.random() * Math.PI * 2;

            // Different orbital inclinations
            const baseInclination =
                (stream - 2.5) * 0.19;

            inclinations[i] =
                baseInclination +
                (Math.random() - 0.5) * 0.32;

            // Some particles orbit backwards
            const direction = Math.random() < 0.12 ? -1 : 1;

            speeds[i] = direction *
                THREE.MathUtils.lerp(0.12, 0.42, Math.random());

            // More variation in particle size
            sizes[i] = THREE.MathUtils.lerp(
                1.5,
                4.8,
                Math.pow(Math.random(), 1.6)
            );

            phases[i] = Math.random() * Math.PI * 2;

            brightness[i] = THREE.MathUtils.lerp(
                0.55,
                1.5,
                Math.random()
            );

            // Pick an individual colour identity
            const colorIndex = Math.floor(
                Math.random() * palette.length
            );

            const color = palette[colorIndex].clone();

            // Slight individual colour variation
            color.offsetHSL(
                (Math.random() - 0.5) * 0.035,
                0,
                (Math.random() - 0.5) * 0.12
            );

            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;
        }

        geometry.setAttribute(
            'position',
            new THREE.BufferAttribute(
                new Float32Array(this.count * 3), 3
            )
        );

        geometry.setAttribute(
            'aRadius',
            new THREE.BufferAttribute(radii, 1)
        );

        geometry.setAttribute(
            'aAngle',
            new THREE.BufferAttribute(angles, 1)
        );

        geometry.setAttribute(
            'aInclination',
            new THREE.BufferAttribute(inclinations, 1)
        );

        geometry.setAttribute(
            'aSpeed',
            new THREE.BufferAttribute(speeds, 1)
        );

        geometry.setAttribute(
            'aSize',
            new THREE.BufferAttribute(sizes, 1)
        );

        geometry.setAttribute(
            'aPhase',
            new THREE.BufferAttribute(phases, 1)
        );

        geometry.setAttribute(
            'aColor',
            new THREE.BufferAttribute(colors, 3)
        );

        geometry.setAttribute(
            'aBrightness',
            new THREE.BufferAttribute(brightness, 1)
        );

        const material = new THREE.ShaderMaterial({
            uniforms: this.uniforms,

            vertexShader: `
                uniform float uTime;
                uniform float uEnergy;

                attribute float aRadius;
                attribute float aAngle;
                attribute float aInclination;
                attribute float aSpeed;
                attribute float aSize;
                attribute float aPhase;
                attribute vec3 aColor;
                attribute float aBrightness;

                varying vec3 vColor;
                varying float vBrightness;
                varying float vAlpha;

                void main() {
                    float time = uTime;

                    // Orbital travel
                    float angle =
                        aAngle + time * aSpeed;

                    // Gentle individual breathing
                    float breathing =
                        sin(time * 1.1 + aPhase) * 0.12;

                    float radius =
                        aRadius + breathing * (0.5 + uEnergy);

                    // Slightly elliptical orbital paths
                    float x = cos(angle) * radius;
                    float z = sin(angle) * radius * 0.78;

                    // Individual vertical motion
                    float wave =
                        sin(angle * 2.0 + aPhase) * 0.16;

                    float y =
                        wave +
                        sin(time * 0.65 + aPhase) * 0.12;

                    // Rotate each stream into its own plane
                    float inc = aInclination;

                    float tiltedY =
                        y * cos(inc) - z * sin(inc);

                    float tiltedZ =
                        y * sin(inc) + z * cos(inc);

                    vec3 particlePosition = vec3(
                        x,
                        tiltedY,
                        tiltedZ
                    );

                    // Energy gently expands the entire system
                    particlePosition *=
                        1.0 + uEnergy * 0.025;

                    vec4 mvPosition =
                        modelViewMatrix *
                        vec4(particlePosition, 1.0);

                    gl_Position =
                        projectionMatrix * mvPosition;

                    // Larger, more visible particles
                    gl_PointSize = clamp(
                        aSize * (85.0 / -mvPosition.z),
                        1.5,
                        12.0
                    );

                    vColor = aColor;
                    vBrightness = aBrightness;

                    // Individual twinkling
                    vAlpha = 0.72 +
                        0.28 * sin(time * 1.5 + aPhase);
                }
            `,

            fragmentShader: `                
                varying vec3 vColor;
                varying float vBrightness;
                varying float vAlpha;

                void main() {
                    vec2 uv = gl_PointCoord - 0.5;
                    float d = length(uv) * 2.0;

                    if (d > 1.0) discard;

                    // Broad coloured atmosphere
                    float atmosphere = exp(-d * 4.5);

                    // Defined luminous body
                    float body = smoothstep(1.0, 0.12, d);

                    // Bright central nucleus
                    float nucleus = exp(-d * 18.0);

                    // Soft outer falloff
                    float halo = exp(-d * 2.8);

                    vec3 color =
                        vColor * (
                            atmosphere * 0.7 +
                            body * 0.65 +
                            nucleus * 1.8
                        );

                    // Slightly warm-white luminous centre
                    color += vec3(0.65, 0.8, 1.0) * nucleus * 0.45;

                    float alpha =
                        (atmosphere * 0.32 +
                        body * 0.55 +
                        nucleus * 0.8) * vAlpha;

                    color *= vBrightness;

                    gl_FragColor = vec4(color, alpha);
                }`,

            transparent: true,
            depthWrite: false,
            depthTest: true,
            blending: THREE.AdditiveBlending,
            toneMapped: false
        });

        this.particles = new THREE.Points(
            geometry,
            material
        );

        this.group.add(this.particles);
    }

    update(dt) {
        this.time += dt;

        this.uniforms.uTime.value = this.time;

        /*this.group.rotation.x += dt * 0.012;
        this.group.rotation.y += dt * 0.018;
        this.group.rotation.z += dt * 0.006;*/
    }

    setEnergy(value) {
        this.energy = THREE.MathUtils.clamp(value, 0, 2);
        this.uniforms.uEnergy.value = this.energy;
    }

    dispose() {
        this.particles.geometry.dispose();
        this.particles.material.dispose();

        this.scene.remove(this.group);
    }
}
