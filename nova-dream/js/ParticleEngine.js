import * as THREE from 'three';
import { shader } from './shaders/particle.js';
//import OrbitMotion from './helpers/OrbitMotion.js';

export default class ParticleEngine {
    constructor(scene, pm, motion, options = {}) {
        this.count = options.count ?? 5000;
        this.innerRadius = options.innerRadius ?? 2.5;
        this.outerRadius = options.outerRadius ?? 5.6;

        this.scene = scene;
        this.paletteManager = pm;
        this.motion = motion;
        this.motion.init(this.count, this.innerRadius, this.outerRadius);


        this.time = 0;
        this.energy = 0.65;
        this.colorIndices = [];

        this.uniforms = {
            uTime: { value: 0 },
            uEnergy: { value: this.energy }
        };

        this.group = new THREE.Group();
        this.createParticles();
        this.scene.add(this.group);
    }
    getColor(colorIndex) {
        const palette = this.paletteManager.getSystemColors('particles');
        const color = palette[colorIndex].clone();

        color.offsetHSL(
            (Math.random() - 0.5) * 0.035,
            0,
            (Math.random() - 0.5) * 0.12
        );
        return color;
    }
    updateColors() {
        const colors = this.particles.geometry.attributes.aColor;
        const palette = this.paletteManager.getSystemColors('particles');

        for (let i = 0; i < this.count; i++) {
            const i3 = i * 3;
            // Preserve each particle's individual colour identity.
            const colorIndex = this.colorIndices[i];
            const color = palette[colorIndex];

            colors.array[i3] = color.r;
            colors.array[i3 + 1] = color.g;
            colors.array[i3 + 2] = color.b;
        }
        colors.needsUpdate = true;
    }
    createParticles() {
        const geometry = new THREE.BufferGeometry();

        const sizes = new Float32Array(this.count);
        const colors = new Float32Array(this.count * 3);
        const brightness = new Float32Array(this.count);

        //const streamCount = 6;
        this.colorIndices = [];

        for ( let i = 0; i < this.count; i++ ) {
            const i3 = i * 3;

            this.motion.create(i);

            // More variation in particle size
            sizes[i] = THREE.MathUtils.lerp(
                1.5,
                4.8,
                Math.pow(Math.random(), 1.6)
            );

            brightness[i] = THREE.MathUtils.lerp(
                0.55,
                1.5,
                Math.random()
            );

            const colorIndex = Math.floor(Math.random() * 6);
            this.colorIndices[i] = colorIndex;
            const color = this.getColor(colorIndex);

            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;
        }

        const attributes = this.motion.getAttributes();

        for (const [name, array] of Object.entries(attributes)) {
            geometry.setAttribute(
                name,
                new THREE.BufferAttribute(array, 1)
            );
        }

        geometry.setAttribute(
            'position',
            new THREE.BufferAttribute(
                new Float32Array(this.count * 3), 3
            )
        );

        geometry.setAttribute(
            'aSize',
            new THREE.BufferAttribute(sizes, 1)
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

        this.particles = new THREE.Points(geometry, material);
        this.group.add(this.particles);
    }

    update(dt) {
        this.time += dt;
        this.uniforms.uTime.value = this.time;
        this.updateColors();
    }

    setEnergy(value) {
        this.energy = THREE.MathUtils.clamp(value, 0, 2);
        this.uniforms.uEnergy.value = this.energy;
    }
    setPalette(p) {
        this.palette = p;
    }

    dispose() {
        this.particles.geometry.dispose();
        this.particles.material.dispose();

        this.scene.remove(this.group);
    }
}
