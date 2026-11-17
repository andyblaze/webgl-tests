import Perlin from '../js/perlin.js';
import { mt_rand } from '../js/functions.js';

export default class SphereNoise {

    constructor(options = {}) {

        this.perlin = new Perlin(mt_rand(1000, 100000));

        this.detailSize = 0.5;
        this.amplitude = 1;
        this.octaves = 4;
        this.persistence = 0.5;

        Object.assign(this, options);
    }
    getPos(positions, i) {
        return {
            x: positions.getX(i),
            y: positions.getY(i),
            z: positions.getZ(i)
        };      
    }
    newPos(pos, length) {
        return {
            x: pos.x / length,
            y: pos.y / length,
            z: pos.z / length
        };
    }
    apply(positions) {
        for ( let i = 0; i < positions.count; i++ ) {
            const pos = this.getPos(positions, i);

            // Direction from sphere centre
            const length = Math.sqrt(pos.x * pos.x + pos.y * pos.y + pos.z * pos.z);

            if ( length === 0 ) continue;

            const newPos = this.newPos(pos, length);

            // Accumulate fractal noise
            let height = 0;
            let frequency = this.detailSize;
            let amplitude = this.amplitude;

            for ( let o = 0; o < this.octaves; o++ ) {
                height += this.perlin.noise(newPos.x * frequency, newPos.y * frequency, newPos.z * frequency) * amplitude;
                frequency *= 2;
                amplitude *= this.persistence;
            }
            // Push/pull vertex radially
            const radius = length + height;

            positions.setXYZ(i, newPos.x * radius, newPos.y * radius, newPos.z * radius);
        }
    }
}
