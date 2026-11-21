import * as THREE from 'three';
import Marker from './Marker.js';
import Trail from './Trail.js';
import TubeGeometry from './TubeGeometry.js';
import Curve from './Curve.js';

export default class Filament {
    static create(index, params, material) {
        const { curve, thickness, phase } = Curve.create(params);

        const geometry = TubeGeometry.create(
            curve, params.segments, params.radialSegments,
            thickness, index, phase
        );

        const mesh = new THREE.Mesh(geometry, material);
        // Marker group
        const marker = Marker.create();
        //const trail = Trail.create(curve);
        //marker.add(trail);

        // Attach marker to filament mesh
        mesh.add(marker);

        const trail = Trail.create(curve);
        mesh.add(trail);

        // Initial position along curve
        const progress = Math.random();

        const speed = THREE.MathUtils.randFloat(0.035, 0.09);

        const direction = Math.random() < 0.5 ? 1 : -1;

        marker.position.copy(curve.getPointAt(progress));     
        trail.position.copy(curve.getPointAt(progress));  

        // Give each filament its own orientation
        mesh.rotation.set(
            THREE.MathUtils.randFloatSpread(0.6),
            0,//THREE.MathUtils.randFloatSpread(Math.PI * 2),
            THREE.MathUtils.randFloatSpread(0.6)
        );

        return { mesh, curve, marker, trail,
            progress, speed, direction };
    }
}
