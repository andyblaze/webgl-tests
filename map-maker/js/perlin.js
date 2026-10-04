export default class Perlin {
    constructor(seed = 12345) {
        this.permutation = new Uint8Array(512);

        // Build a shuffled permutation table from the seed.
        const p = new Uint8Array(256);

        for (let i = 0; i < 256; i++) {
            p[i] = i;
        }

        let s = seed;

        // Simple seeded pseudo-random generator.
        const random = () => {
            s = (s * 1664525 + 1013904223) >>> 0;
            return s / 4294967296;
        };

        // Fisher-Yates shuffle.
        for (let i = 255; i > 0; i--) {
            const j = Math.floor(random() * (i + 1));

            const temp = p[i];
            p[i] = p[j];
            p[j] = temp;
        }

        // Duplicate the table so we don't need wrapping logic later.
        for (let i = 0; i < 512; i++) {
            this.permutation[i] = p[i & 255];
        }
    }
    fade(t) {
        // Ken Perlin's improved smoothstep.
        return t * t * t * (t * (t * 6 - 15) + 10);
    }
    lerp(a, b, t) {
        return a + t * (b - a);
    }
    gradient(hash, x, y) {
        // Four possible diagonal/cardinal-ish directions.
        switch (hash & 3) {
            case 0: return  x + y;
            case 1: return -x + y;
            case 2: return  x - y;
            case 3: return -x - y;
        }
    }
    noise(x, y) {
        // Grid cell.
        const x0 = Math.floor(x);
        const y0 = Math.floor(y);

        // Position inside cell.
        const xf = x - x0;
        const yf = y - y0;

        // Wrap coordinates into permutation table.
        const X = x0 & 255;
        const Y = y0 & 255;

        // Fade curves.
        const u = this.fade(xf);
        const v = this.fade(yf);

        // Hash the four corners.
        const aa = this.permutation[
            this.permutation[X] + Y
        ];

        const ab = this.permutation[
            this.permutation[X] + Y + 1
        ];

        const ba = this.permutation[
            this.permutation[X + 1] + Y
        ];

        const bb = this.permutation[
            this.permutation[X + 1] + Y + 1
        ];

        // Gradient contribution from each corner.
        const n00 = this.gradient(aa,     xf,     yf);
        const n10 = this.gradient(ba,     xf - 1, yf);
        const n01 = this.gradient(ab,     xf,     yf - 1);
        const n11 = this.gradient(bb,     xf - 1, yf - 1);

        // Interpolate.
        const nx0 = this.lerp(n00, n10, u);
        const nx1 = this.lerp(n01, n11, u);

        const value = this.lerp(nx0, nx1, v);

        // Keep output roughly in the useful 0 -> 1 range.
        return value * 0.5 + 0.5;
    }
}
