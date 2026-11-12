/*import Perlin from './perlin.js';
import { mt_rand } from './functions.js';*/
import Noise from '../deformers/noise.js';
import Hills from '../deformers/hills.js';
import Mountain from '../deformers/mountain.js';

export default class Factory {
    constructor() {
        this.data = {
            "noise": {
                ctor: Noise
            },
            "hills": {
                ctor: Hills
            },
            "mountain": {
                ctor: Mountain
            }
        };
    }
    create(key) {
        const cls = this.data[key];
        return new cls.ctor();
    }
}
