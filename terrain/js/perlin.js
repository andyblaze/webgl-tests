export default class Perlin {
    constructor(seed=12345) {

        // Seeded random number generator
        const random = () => {
            seed |= 0;
            seed = seed + 0x6D2B79F5 | 0;

            let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
            t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;

            return ((t ^ t >>> 14) >>> 0) / 4294967296;
        };

        // Create and shuffle permutation table
        const p = Array.from({ length: 256 }, (_, i) => i);

        for (let i = 255; i > 0; i--) {
            const j = Math.floor(random() * (i + 1));
            [p[i], p[j]] = [p[j], p[i]];
        }

        // Duplicate table to avoid overflow
        this.permutation = [...p, ...p];

        this.gradients = [
            [1, 0], [-1, 0],
            [0, 1], [0, -1],
            [Math.SQRT1_2, Math.SQRT1_2],
            [-Math.SQRT1_2, Math.SQRT1_2],
            [Math.SQRT1_2, -Math.SQRT1_2],
            [-Math.SQRT1_2, -Math.SQRT1_2]
        ];
    }
    fade(t) {
        return t * t * t * (t * (t * 6 - 15) + 10);
    }
    lerp(a, b, t) {
        return a + t * (b - a);
    }
    grad(hash, x, y) {
        const g = this.gradients[hash & 7];
        return g[0] * x + g[1] * y;
    }
    noise(x, y) {

        const p = this.permutation;

        const floorX = Math.floor(x);
        const floorY = Math.floor(y);

        const xi = floorX & 255;
        const yi = floorY & 255;

        const xf = x - floorX;
        const yf = y - floorY;

        const u = this.fade(xf);
        const v = this.fade(yf);

        const aa = p[p[xi] + yi];
        const ab = p[p[xi] + yi + 1];
        const ba = p[p[xi + 1] + yi];
        const bb = p[p[xi + 1] + yi + 1];

        const n1 = this.lerp(
            this.grad(aa, xf, yf),
            this.grad(ba, xf - 1, yf),
            u
        );

        const n2 = this.lerp(
            this.grad(ab, xf, yf - 1),
            this.grad(bb, xf - 1, yf - 1),
            u
        );

        return this.lerp(n1, n2, v);
    }
}
