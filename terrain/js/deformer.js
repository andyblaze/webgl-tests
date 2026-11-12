import Noise from '../deformers/noise.js';
import Hills from '../deformers/hills.js';
import Mountain from '../deformers/mountain.js';
import Smoothing from '../deformers/smoothing.js';

export default class DeformerFactory {
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
            },
            "smoothing": {
                ctor: Smoothing
            }
        };
    }
    create(key) {
        const cls = this.data[key];
        return new cls.ctor();
    }
}
