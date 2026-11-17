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
        pos.y += amount;
    }
    getHeight(pos, frequency) {
        return this.perlin.noise(pos.x * frequency, pos.z * frequency);
    }
    getLength(pos) {
        return 1;
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
            
            const length = this.getLength(pos);
            
            this.transform(pos, length);

            let distortion = 0;
            let frequency = this.detailSize;
            let amplitude = this.amplitude;

            /*for ( let o = 0; o < this.octaves; o++ ) {
                distortion += this.getHeight(pos, frequency) * amplitude;
                frequency *= 2;
                amplitude *= this.persistence;
            }*/
            distortion = this.applyOctaves(pos, distortion, frequency, amplitude);
            this.distort(pos, distortion);
            positions.setXYZ(i, pos.x, pos.y, pos.z);
        }
    }
}
