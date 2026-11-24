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

        const attrs = {
            aSize : new Float32Array(this.count),
            aColor: new Float32Array(this.count * 3),
            aBrightness: new Float32Array(this.count)
        };

        const motion = this.motion;
        this.colorIndices = [];

        for ( let i = 0; i < this.count; i++ ) {
            const i3 = i * 3;

            motion.create(i);

            attrs.aSize[i] = this.getSize();
            attrs.aBrightness[i] = this.getBrightness();

            const color = this.getColorAt(i);

            attrs.aColor[i3] = color.r;
            attrs.aColor[i3 + 1] = color.g;
            attrs.aColor[i3 + 2] = color.b;
        }

        const attributes = motion.getAttributes();
        //Object.assign(attributes, attrs);

        for ( const [name, array] of Object.entries(attributes) ) {
            geometry.setAttribute(
                name,
                new THREE.BufferAttribute(array, 1)
            );
        }

        for ( const [name, array] of Object.entries(attrs) ) {
            const n = name === "aColor" ? 3 : 1;
            geometry.setAttribute(
                name,
                new THREE.BufferAttribute(array, n)
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
