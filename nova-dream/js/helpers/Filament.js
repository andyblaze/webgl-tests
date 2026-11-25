import * as THREE from 'three';
import Marker from './Marker.js';
import Trail from './Trail.js';
import TubeGeometry from './TubeGeometry.js';
import Curve from './Curve.js';

export default class Filament {
    constructor(index, params, material, pm) {
        this.paletteManager = pm;
        this.thickness = THREE.MathUtils.lerp(
            params.minThickness,
            params.maxThickness,
            Math.random()
        );
        this.phase = Math.random() * Math.PI * 2;
        this.curve = Curve.create(params, this.phase);

        this.createMesh(params, index, material);

        // Initial position along curve
        this.progress = Math.random();
        this.speed = THREE.MathUtils.randFloat(0.035, 0.09);
        this.direction = Math.random() < 0.5 ? 1 : -1;

        // Marker group
        this.marker = Marker.create(pm);
        this.mesh.add(this.marker);

        this.trail = new Trail(this.paletteManager);
        this.mesh.add(this.trail.mesh);

        this.marker.position.copy(this.curve.getPointAt(this.progress));     

        // Give each filament its own orientation
        this.mesh.rotation.set(
            THREE.MathUtils.randFloatSpread(0.6),
            0,//THREE.MathUtils.randFloatSpread(Math.PI * 2),
            THREE.MathUtils.randFloatSpread(0.6)
        );
    }
    createMesh(params, index, material) {
        const geometry = TubeGeometry.create(
            this.curve, params.segments, params.radialSegments,
            this.thickness, index, this.phase
        );
        this.mesh = new THREE.Mesh(geometry, material);        
    }
    update(dt) {
        this.progress += this.speed * dt * this.direction;
        // Reverse at either end of the filament
        if (this.progress >= 1.0) {
            this.progress = 1.0;
            this.direction = -1;
        }

        if (this.progress <= 0.0) {
            this.progress = 0.0;
            this.direction = 1;
        }
        Marker.updatePalette(this.marker, this.paletteManager);
        // Follow the actual curved filament path
        this.marker.position.copy(
            this.curve.getPointAt(
                this.progress
            )
        );
        this.trail.updatePalette(this.paletteManager);
        this.trail.update(this);
    }
}
