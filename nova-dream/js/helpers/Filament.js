import { MathUtils, Mesh } from 'three';
import Marker from './Marker.js';
import Trail from './Trail.js';
import TubeGeometry from './TubeGeometry.js';
import Curve from './Curve.js';

export default class Filament {
    constructor(index, params, pm) {
        this.index = index;
        this.params = params;
        this.paletteManager = pm;
        this.thickness = MathUtils.lerp(
            params.minThickness,
            params.maxThickness,
            Math.random()
        );
        this.phase = Math.random() * Math.PI * 2;
        // Initial position along curve
        this.progress = Math.random();
        this.speed = MathUtils.randFloat(0.035, 0.09);
        this.direction = 1//Math.random() < 0.5 ? 1 : -1;
    }
    render(material) {
        this.curve = Curve.create(this.params, this.phase);
        this.mesh = this.createMesh(material);

        // Marker group
        this.marker = Marker.create(this.paletteManager);
        this.mesh.add(this.marker);

        this.trail = new Trail(this.paletteManager);
        this.mesh.add(this.trail.mesh);

        this.marker.position.copy(this.curve.getPointAt(this.progress));     

        // Give each filament its own orientation
        this.mesh.rotation.set(
            MathUtils.randFloatSpread(0.6),
            0,//THREE.MathUtils.randFloatSpread(Math.PI * 2),  !! maybe put back later
            MathUtils.randFloatSpread(0.6)
        );
    }
    createMesh(material) {
        const geometry = TubeGeometry.create(
            this.curve, this.params.segments, this.params.radialSegments,
            this.thickness, this.index, this.phase
        );
        return new Mesh(geometry, material);        
    }
    update(dt) {
        this.progress = (this.progress + this.speed * dt) % 1.0;
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
