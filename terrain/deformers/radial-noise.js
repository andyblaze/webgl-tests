import Perlin from '../js/perlin.js';
import { mt_rand } from '../js/functions.js';

export default class SphereNoise {

    constructor(options = {}) {

        this.perlin = new Perlin(mt_rand(1000, 100000));

        this.detailSize = 0.5;
        this.amplitude = 1;
        this.octaves = 4;
        this.persistence = 0.5;
        this.strategy = null;

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
        this.strategy.transform(pos, length);
    }
    distort(pos, amount) {
        this.strategy.distort(pos, amount);
    }
    getHeight(pos, frequency) {
        return this.perlin.noise3D(pos.x * frequency, pos.y * frequency, pos.z * frequency);
    }
    getLength(pos) {
        return this.strategy.getLength(pos);
    }
    applyOctaves(pos, length=0) {
        let distortion = 0;
        let frequency = this.detailSize;
        let amplitude = this.amplitude;
        for ( let o = 0; o < this.octaves; o++ ) {
            distortion += this.getHeight(pos, frequency) * amplitude;
            frequency *= 2;
            amplitude *= this.persistence;
        }
        return distortion + length;
    }
    apply(positions) {
        for ( let i = 0; i < positions.count; i++ ) {
            const pos = this.getPos(positions, i);
            const length = this.getLength(pos);

            if ( length > 0 ) {
                this.transform(pos, length);             
                const distortion = this.applyOctaves(pos, length);
                this.distort(pos, distortion);
                positions.setXYZ(i, pos.x, pos.y, pos.z);
            }
        }
    }
}
