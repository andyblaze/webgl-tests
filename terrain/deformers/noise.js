
import Perlin from '../js/perlin.js';
import { mt_rand } from '../js/functions.js';

export default class Noise {
    constructor(options = {}) {
        this.perlin = new Perlin(mt_rand(1000, 100000));

        this.detailSize = 0.05;
        this.amplitude = 1;
        this.octaves = 1;
        this.persistence = 0.5;

        Object.assign(this, options);
    }
apply(positions) {
    for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i);
        const z = positions.getZ(i);

        let height = 0;
        let frequency = this.detailSize;
        let amplitude = this.amplitude;

        for (let o = 0; o < this.octaves; o++) {
            height += this.perlin.noise(
                x * frequency,
                z * frequency
            ) * amplitude;

            frequency *= 2;
            amplitude *= this.persistence;
        }

        positions.setY(
            i,
            positions.getY(i) + height
        );
    }
}
}
