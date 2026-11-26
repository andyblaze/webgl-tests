import { ShaderMaterial, AdditiveBlending, BufferGeometry, BufferAttribute, Points } from "three";
import { trailShader } from "../shaders/trail.js";

export default class Trail {    
    constructor(paletteManager) {
        const color = paletteManager.getSystemColors("trail")[0];
        this.material = new ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uTrailColor: { value: color.clone() }
            },
            vertexShader: trailShader.vertex,
            fragmentShader: trailShader.fragment,
            transparent: true,
            depthWrite: false,
            blending: AdditiveBlending,
            toneMapped: false
        });
        this.pointCount = 60;
        this.length = 0.12;

        const count = this.pointCount;
        const geometry = new BufferGeometry();

        const positions = new Float32Array(count * 3);
        const progress = new Float32Array(count);

        for (let i = 0; i < count; i++) {
            progress[i] = i / (count - 1);
        }

        geometry.setAttribute(
            'position',
            new BufferAttribute(positions, 3)
        ); 

        geometry.setAttribute(
            'aTrailProgress',
            new BufferAttribute(progress, 1)
        );

        this.mesh = new Points(
            geometry,
            this.material
        );
        this.mesh.frustumCulled = false;
    }
    update(filament) {
        const positions = this.mesh.geometry.attributes.position;
        const count = this.pointCount;

        for (let i = 0; i < count; i++) {
            const t = i / (count - 1);

            let trailProgress =
                filament.progress - filament.direction * this.length * t;

            // Wrap around the closed curve
            trailProgress = (trailProgress % 1 + 1) % 1;

            const point = filament.curve.getPointAt(trailProgress);

            positions.setXYZ(i, point.x, point.y, point.z);
        }

        positions.needsUpdate = true;
    }
    updatePalette(paletteManager) {
        const color = paletteManager.getSystemColors("trail")[0];
        this.material.uniforms.uTrailColor.value.copy(color);
    }
    updateMaterial(dt) {
        this.material.uniforms.uTime.value += dt;
    }
}
