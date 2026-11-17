import Perlin from '../js/perlin.js';
import { mt_rand } from '../js/functions.js';

export default class SphereHills {

    constructor(options = {}) {

        this.perlin = new Perlin(mt_rand(1000, 100000));

        this.detailSize = 0.5;
        this.amplitude = 1;
        this.octaves = 4;
        this.persistence = 0.5;

        Object.assign(this, options);
    }

    apply(positions) {

        for (let i = 0; i < positions.count; i++) {

            const x = positions.getX(i);
            const y = positions.getY(i);
            const z = positions.getZ(i);

            // Direction from sphere centre
            const length = Math.sqrt(x*x + y*y + z*z);

            if (length === 0) continue;

            const nx = x / length;
            const ny = y / length;
            const nz = z / length;

            // Accumulate fractal noise
            let height = 0;
            let frequency = this.detailSize;
            let amplitude = this.amplitude;

            for (let o = 0; o < this.octaves; o++) {

                height += this.perlin.noise(
                    nx * frequency,
                    ny * frequency,
                    nz * frequency
                ) * amplitude;

                frequency *= 2;
                amplitude *= this.persistence;
            }

            // Push/pull vertex radially
            const radius = length + height;

            positions.setXYZ(
                i,
                nx * radius,
                ny * radius,
                nz * radius
            );
        }
    }
}
