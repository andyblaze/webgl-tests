export default class CurlNoise {

    constructor(noiseFunction) {
        this.noise = noiseFunction;
    }


    get(x, y, time) {

        const eps = 0.001;

        const n1 = this.noise(
            x,
            y + eps,
            time
        );

        const n2 = this.noise(
            x,
            y - eps,
            time
        );

        const a = (n1 - n2) / (2 * eps);


        const n3 = this.noise(
            x + eps,
            y,
            time
        );

        const n4 = this.noise(
            x - eps,
            y,
            time
        );

        const b = (n3 - n4) / (2 * eps);


        return {
            x: a,
            y: -b
        };
    }
}