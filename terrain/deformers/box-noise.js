import Perlin from '../js/perlin.js';
import { mt_rand } from '../js/functions.js';

export default class BoxNoise {
    constructor(options = {}) {
        this.perlin = new Perlin(mt_rand(1000, 100000));

        this.detailSize = 0.05;
        this.amplitude = 1;
        this.octaves = 1;
        this.persistence = 0.5;

        Object.assign(this, options);
    }
    getHeight(pos, frequency) {
        return this.perlin.noise3D(
            pos.x * frequency,
            pos.y * frequency,
            pos.z * frequency
        );
    }
    applyOctaves(pos) {
        let height = 0;
        let frequency = this.detailSize;
        let amplitude = this.amplitude;

        for ( let o = 0; o < this.octaves; o++ ) {
            height += this.getHeight(pos, frequency) * amplitude;
            frequency *= 2;
            amplitude *= this.persistence;
        }  
        return height;      
    }
    getPos(positions, i) {
        return {
            x: positions.getX(i),
            y: positions.getY(i),
            z: positions.getZ(i)
        };      
    }
    getNorm(normals, i) {
        return {
            x: normals.getX(i),
            y: normals.getY(i),
            z: normals.getZ(i)
        };
    }
    distort(pos, amount, normals=null, i) {
        const norm = normals ? this.getNorm(normals, i) : {x:1, y:1, z:1};

        pos.x += norm.x * amount;
        pos.y += norm.y * amount;
        pos.z += norm.z * amount;       
    }
    getLength(pos) {
        return 1;
    }
    transform(pos, length) {

    }
    apply(positions, normals) {
        for (let i = 0; i < positions.count; i++) {

            const pos = this.getPos(positions, i);

            const length = this.getLength(pos);

            if ( length > 0 ) {
                this.transform(pos, length);
                const distortion = this.applyOctaves(pos);
                this.distort(pos, distortion, normals, i);

                positions.setXYZ(i, pos.x, pos.y, pos.z);
            }
        }
    }
}