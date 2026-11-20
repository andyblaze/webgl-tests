import * as THREE from 'three';
import { shader } from './shaders/particle.js';

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
            vertexShader: shader.vertex,
            fragmentShader: shader.fragment,

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
