import * as THREE from 'three';
import Marker from './Marker.js';
import Trail from './Trail.js';
import TubeGeometry from './TubeGeometry.js';
import Curve from './Curve.js';

export default class Filament {
    constructor(index, params, material) {
        const { curve, thickness, phase } = Curve.create(params);
        this.curve = curve; 

        this.createMesh(params, thickness, index, phase, material);
        // Marker group
        this.marker = Marker.create();
        //const trail = Trail.create(curve);
        //marker.add(trail);

        // Attach marker to filament mesh
        this.mesh.add(this.marker);

        this.trail = Trail.create(curve);
        this.mesh.add(this.trail);

        // Initial position along curve
        this.progress = Math.random();

        this.speed = THREE.MathUtils.randFloat(0.035, 0.09);

        this.direction = Math.random() < 0.5 ? 1 : -1;

        this.marker.position.copy(curve.getPointAt(this.progress));     
        this.trail.position.copy(curve.getPointAt(this.progress));  

        // Give each filament its own orientation
        this.mesh.rotation.set(
            THREE.MathUtils.randFloatSpread(0.6),
            0,//THREE.MathUtils.randFloatSpread(Math.PI * 2),
            THREE.MathUtils.randFloatSpread(0.6)
        );
    }
    createMesh(params, thickness, index, phase, material) {
        const geometry = TubeGeometry.create(
            this.curve, params.segments, params.radialSegments,
            thickness, index, phase
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
        // Follow the actual curved filament path
        this.marker.position.copy(
            this.curve.getPointAt(
                this.progress
            )
        );
        this.trail.position.copy(
            this.curve.getPointAt(
                this.progress
            )
        );
    }
}
