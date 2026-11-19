
import * as THREE from 'three';

export class ParticleEngine {
    constructor(scene, options = {}) {
        this.scene = scene;

        this.count = options.count ?? 5000;
        this.innerRadius = options.innerRadius ?? 2.4;
        this.outerRadius = options.outerRadius ?? 5.8;

        this.time = 0;
        this.energy = 0.5;

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

        const positions = new Float32Array(this.count * 3);
        const radii = new Float32Array(this.count);
        const angles = new Float32Array(this.count);
        const heights = new Float32Array(this.count);
        const speeds = new Float32Array(this.count);
        const sizes = new Float32Array(this.count);
        const phases = new Float32Array(this.count);
        const colors = new Float32Array(this.count * 3);

        const colorPalette = [
            new THREE.Color(0x00eaff),
            new THREE.Color(0x653cff),
            new THREE.Color(0xff32bd),
            new THREE.Color(0xffa52f),
            new THREE.Color(0x9b70ff)
        ];

        for (let i = 0; i < this.count; i++) {
            const i3 = i * 3;

            // Spherical distribution
            const theta = Math.acos(2 * Math.random() - 1);
            const phi = Math.random() * Math.PI * 2;

            // Slightly favour particles around the orbital plane
            const orbitalBias = Math.pow(Math.abs(Math.sin(theta)), 0.65);

            const radius = THREE.MathUtils.lerp(
                this.innerRadius,
                this.outerRadius,
                Math.random()
            );

            positions[i3] = Math.sin(theta) * Math.cos(phi);
            positions[i3 + 1] = Math.cos(theta);
            positions[i3 + 2] = Math.sin(theta) * Math.sin(phi);

            radii[i] = radius;
            angles[i] = phi;
            heights[i] = orbitalBias;
            
            // Different orbital speeds and directions
            speeds[i] = THREE.MathUtils.lerp(0.08, 0.35, Math.random());

            sizes[i] = THREE.MathUtils.lerp(1.0, 3.2, Math.random());

            phases[i] = Math.random() * Math.PI * 2;

            // Choose and blend nearby cosmic palette colours
            const paletteIndex = Math.floor(
                Math.random() * colorPalette.length
            );

            const color = colorPalette[paletteIndex].clone();

            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;
        }

        geometry.setAttribute(
            'position',
            new THREE.BufferAttribute(positions, 3)
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
            'aHeight',
            new THREE.BufferAttribute(heights, 1)
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

        const material = new THREE.ShaderMaterial({
            uniforms: this.uniforms,

            vertexShader: `
                uniform float uTime;
                uniform float uEnergy;

                attribute float aRadius;
                attribute float aAngle;
                attribute float aHeight;
                attribute float aSpeed;
                attribute float aSize;
                attribute float aPhase;
                attribute vec3 aColor;

                varying vec3 vColor;
                varying float vAlpha;

                void main() {
                    float time = uTime;

                    // Individual orbital movement
                    float angle = aAngle + time * aSpeed;

                    // Energy-driven radial breathing
                    float breathing = sin(
                        time * 0.8 + aPhase
                    ) * (0.12 + uEnergy * 0.22);

                    float radius = aRadius + breathing;

                    // Gentle turbulence
                    float turbulence = sin(
                        time * 0.7 + aPhase
                    ) * 0.12;

                    float verticalDrift = cos(
                        time * 0.45 + aPhase
                    ) * 0.18;

                    // Spherical cloud with orbital bias
                    vec3 particlePosition;

                    particlePosition.x =
                        cos(angle) * radius
                        + turbulence;

                    particlePosition.y =
                        position.y * radius
                        + verticalDrift;

                    particlePosition.z =
                        sin(angle) * radius
                        + turbulence * 0.5;

                    // Subtle energy expansion
                    particlePosition *=
                        1.0 + uEnergy * 0.035;

                    vec4 mvPosition =
                        modelViewMatrix *
                        vec4(particlePosition, 1.0);

                    gl_Position =
                        projectionMatrix * mvPosition;

                    gl_PointSize = clamp(
                        aSize * (35.0 / -mvPosition.z),
                        1.0,
                        7.0
                    );

                    vColor = aColor;

                    vAlpha = 0.55 +
                        0.35 * sin(time + aPhase);
                }
            `,

            fragmentShader: `
                varying vec3 vColor;
                varying float vAlpha;

                void main() {
                    vec2 uv = gl_PointCoord - 0.5;

                    float distanceFromCenter = length(uv);

                    if (distanceFromCenter > 0.5) {
                        discard;
                    }

                    // Soft glowing particle
                    float glow = exp(
                        -distanceFromCenter * 12.0
                    );

                    float core = exp(
                        -distanceFromCenter * 35.0
                    );

                    vec3 finalColor =
                        vColor * (glow + core * 0.8);

                    float alpha =
                        glow * vAlpha;

                    gl_FragColor = vec4(
                        finalColor,
                        alpha
                    );
                }
            `,

            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending
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

        // Slow overall movement of the particle cloud
        this.group.rotation.x += dt * 0.00000012;
        this.group.rotation.y += dt * 0.00000018;
        this.group.rotation.z += dt * 0.00000006;
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
