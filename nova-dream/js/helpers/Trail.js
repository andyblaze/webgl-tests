import * as THREE from 'three';
import { trailShader } from '../shaders/trail.js';

export default class Trail {    
    static material = new THREE.ShaderMaterial({
        uniforms: {
            uTime: { value: 0 }
        },
        vertexShader: trailShader.vertex,
        fragmentShader: trailShader.fragment,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        toneMapped: false
    });
    static pointCount = 40;
    static length = 0.13;
    static geometry = new THREE.BufferGeometry();

    static create(curve) {
        const count = this.pointCount;

        //const geometry = new THREE.BufferGeometry();

        const positions = new Float32Array(count * 3);
        const progress = new Float32Array(count);

        for (let i = 0; i < count; i++) {
            progress[i] = i / (count - 1);
        }

        this.geometry.setAttribute(
            'position',
            new THREE.BufferAttribute(positions, 3)
        );

        this.geometry.setAttribute(
            'aTrailProgress',
            new THREE.BufferAttribute(progress, 1)
        );

        const trail = new THREE.Points(
            this.geometry,
            this.material
        );

        trail.frustumCulled = false;

        return trail;
    }
    static update(filament) {
        const positions = this.geometry.attributes.position;
        const count = this.pointCount;

        for ( let i = 0; i < count; i++ ) {
            const t = i / (count - 1);

            // Sample backwards from the moving marker
            const trailProgress =
                filament.progress -
                filament.direction * this.length * t;

            const clampedProgress = THREE.MathUtils.clamp(trailProgress, 0, 1);
            const point = filament.curve.getPointAt(clampedProgress);

            positions.setXYZ(i, point.x, point.y, point.z);
        }
        positions.needsUpdate = true;
    }
    static updateMaterial(dt) {
        this.material.uniforms.uTime.value += dt;
    }
}
