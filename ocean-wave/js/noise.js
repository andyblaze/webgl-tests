export default class Noise {
    constructor(seed = Math.random() * 10000) {
        this.seed = seed;
    }

    random(x) {
        const v = Math.sin(x * 127.1 + this.seed) * 43758.5453123;
        return v - Math.floor(v);
    }

    smooth(t) {
        return t * t * (3 - 2 * t);
    }

    sample(x) {
        const x0 = Math.floor(x);
        const x1 = x0 + 1;

        const v0 = this.random(x0);
        const v1 = this.random(x1);

        const f = this.smooth(x - x0);

        return v0 * (1 - f) + v1 * f;
    }
}
