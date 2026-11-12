import Perlin from '../js/perlin.js';
import { mt_rand } from '../js/functions.js';

export default class Noise {
    constructor(options = {}) {
        this.perlin = new Perlin(mt_rand(1000, 100000));
        this.scale = 0.16;
        this.amplitude = 3;    
        Object.assign(this, options);
    }
    apply(positions) {
        for (let i = 0; i < positions.count; i++) {

            const x = positions.getX(i);
            const z = positions.getZ(i);
            const height = this.perlin.noise(x * this.scale, z * this.scale);

            positions.setY(i, positions.getY(i) + height * this.amplitude);
        }
    }
}
