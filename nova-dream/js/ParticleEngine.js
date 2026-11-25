import * as THREE from 'three';
import { shader } from './shaders/particle.js';

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
        const colors = this.particles.geometry.attributes.stdColor;
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
    getSize() {
        // More variation in particle size
        return THREE.MathUtils.lerp(1.5, 4.8, Math.pow(Math.random(), 1.6));
    }
    getBrightness() {
        return THREE.MathUtils.lerp(0.55, 1.5, Math.random());
    }
    getColorAt(i) {
        const colorIndex = Math.floor(Math.random() * 6);
        this.colorIndices[i] = colorIndex;
        return this.getColor(colorIndex);
    }
    createParticles() {
        const geometry = new THREE.BufferGeometry();

        const stdAttrs = {
            stdSize : { array: new Float32Array(this.count), size: 1 },
            stdColor: { array: new Float32Array(this.count * 3), size: 3 },
            stdBrightness: { array: new Float32Array(this.count), size: 1 }
        };

        const motion = this.motion;
        this.colorIndices = [];

        for ( let i = 0; i < this.count; i++ ) {
            const i3 = i * 3;

            motion.create(i);

            stdAttrs.stdSize.array[i] = this.getSize();
            stdAttrs.stdBrightness.array[i] = this.getBrightness();

            const color = this.getColorAt(i);

            stdAttrs.stdColor.array[i3] = color.r;
            stdAttrs.stdColor.array[i3 + 1] = color.g;
            stdAttrs.stdColor.array[i3 + 2] = color.b;
        }

        const allAttrs = {
            ...motion.getAttributes(),
            ...stdAttrs
        };

        for ( const [key, val] of Object.entries(allAttrs) ) {
            //const n = name === "stdColor" ? 3 : 1;
            geometry.setAttribute(
                key,
                new THREE.BufferAttribute(val.array, val.size)
            );
        }

        geometry.setAttribute(
            'position',
            new THREE.BufferAttribute(
                new Float32Array(this.count * 3), 3
            )
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
