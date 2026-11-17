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
    transform(pos, length=1) {
        pos.x /= length;
        pos.y /= length;
        pos.z /= length;
    }
    distort(pos, amount) {
        pos.x *= amount;
        pos.y *= amount;
        pos.z *= amount;
    }
    getHeight(pos, frequency) {
        return this.perlin.noise(pos.x * frequency, pos.y * frequency, pos.z * frequency);
    }
    getLength(pos) {
        return Math.sqrt(pos.x * pos.x + pos.y * pos.y + pos.z * pos.z);
    }
    applyOctaves(pos, distortion, frequency, amplitude) {
        for ( let o = 0; o < this.octaves; o++ ) {
            distortion += this.getHeight(pos, frequency) * amplitude;
            frequency *= 2;
            amplitude *= this.persistence;
        }
        return distortion;
    }
    apply(positions) {
        for ( let i = 0; i < positions.count; i++ ) {
            const pos = this.getPos(positions, i);

            // Direction from sphere centre
            const length = this.getLength(pos);

            if ( length === 0 ) continue;

            this.transform(pos, length);

            // Accumulate fractal noise
            let distortion = 0;
            let frequency = this.detailSize;
            let amplitude = this.amplitude;

            /*for ( let o = 0; o < this.octaves; o++ ) {
                distortion += this.getHeight(pos, frequency) * amplitude;
                frequency *= 2;
                amplitude *= this.persistence;
            }*/
            distortion = this.applyOctaves(pos, distortion, frequency, amplitude);
            // Push/pull vertex radially
            //const distortion = length + height;
            this.distort(pos, distortion + length);

            positions.setXYZ(i, pos.x, pos.y, pos.z);
        }
    }
}
