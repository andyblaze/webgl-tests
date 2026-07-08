export default class SimplexNoise {

    constructor() {
        this.gradients = [
            [1, 1],
            [-1, 1],
            [1, -1],
            [-1, -1],
            [1, 0],
            [-1, 0],
            [0, 1],
            [0, -1]
        ];

        this.permutation = [];

        for (let i = 0; i < 256; i++) {
            this.permutation[i] = i;
        }

        // shuffle
        for (let i = 255; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.permutation[i], this.permutation[j]] =
                [this.permutation[j], this.permutation[i]];
        }

        this.permutation = [
            ...this.permutation,
            ...this.permutation
        ];
    }


    dot(g, x, y) {
        return g[0] * x + g[1] * y;
    }


    noise(x, y) {

        const F2 = 0.5 * (Math.sqrt(3) - 1);
        const G2 = (3 - Math.sqrt(3)) / 6;

        const s = (x + y) * F2;

        const i = Math.floor(x + s);
        const j = Math.floor(y + s);

        const t = (i + j) * G2;

        const X0 = i - t;
        const Y0 = j - t;

        const x0 = x - X0;
        const y0 = y - Y0;


        let i1, j1;

        if (x0 > y0) {
            i1 = 1;
            j1 = 0;
        } else {
            i1 = 0;
            j1 = 1;
        }


        const x1 = x0 - i1 + G2;
        const y1 = y0 - j1 + G2;

        const x2 = x0 - 1 + 2 * G2;
        const y2 = y0 - 1 + 2 * G2;


        const ii = i & 255;
        const jj = j & 255;


        const gi0 = this.permutation[ii + this.permutation[jj]] % 8;
        const gi1 = this.permutation[
            ii + i1 + this.permutation[jj + j1]
        ] % 8;
        const gi2 = this.permutation[
            ii + 1 + this.permutation[jj + 1]
        ] % 8;


        let n0 = 0;
        let n1 = 0;
        let n2 = 0;


        let t0 = 0.5 - x0*x0 - y0*y0;

        if (t0 > 0) {
            t0 *= t0;
            n0 = t0 * t0 * this.dot(this.gradients[gi0], x0, y0);
        }


        let t1 = 0.5 - x1*x1 - y1*y1;

        if (t1 > 0) {
            t1 *= t1;
            n1 = t1 * t1 * this.dot(this.gradients[gi1], x1, y1);
        }


        let t2 = 0.5 - x2*x2 - y2*y2;

        if (t2 > 0) {
            t2 *= t2;
            n2 = t2 * t2 * this.dot(this.gradients[gi2], x2, y2);
        }


        return 70 * (n0 + n1 + n2);
    }


    get(x, y, time) {

        const scale = 0.005;

        return {

            x: this.noise(
                x * scale,
                y * scale + time
            ),

            y: this.noise(
                x * scale + 100,
                y * scale + time
            )

        };
    }
}
