
export default class Perlin {
    constructor(seed = 12345) {

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

        // 2D gradients (existing)
        this.gradients = [
            [1, 0], [-1, 0],
            [0, 1], [0, -1],
            [Math.SQRT1_2, Math.SQRT1_2],
            [-Math.SQRT1_2, Math.SQRT1_2],
            [Math.SQRT1_2, -Math.SQRT1_2],
            [-Math.SQRT1_2, -Math.SQRT1_2]
        ];

        // 3D gradients
        this.gradients3D = [
            [1, 1, 0], [-1, 1, 0],
            [1, -1, 0], [-1, -1, 0],
            [1, 0, 1], [-1, 0, 1],
            [1, 0, -1], [-1, 0, -1],
            [0, 1, 1], [0, -1, 1],
            [0, 1, -1], [0, -1, -1]
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

    grad3(hash, x, y, z) {
        const g = this.gradients3D[hash % 12];
        return g[0] * x + g[1] * y + g[2] * z;
    }

    // Existing 2D noise - unchanged
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

    // New 3D noise
    noise3D(x, y, z) {
        const p = this.permutation;

        const floorX = Math.floor(x);
        const floorY = Math.floor(y);
        const floorZ = Math.floor(z);

        const xi = floorX & 255;
        const yi = floorY & 255;
        const zi = floorZ & 255;

        const xf = x - floorX;
        const yf = y - floorY;
        const zf = z - floorZ;

        const u = this.fade(xf);
        const v = this.fade(yf);
        const w = this.fade(zf);

        // Hash the eight corners of the cube
        const hash = (dx, dy, dz) =>
            p[p[p[xi + dx] + yi + dy] + zi + dz];

        // Calculate gradient values at each corner
        const n000 = this.grad3(hash(0, 0, 0), xf, yf, zf);
        const n100 = this.grad3(hash(1, 0, 0), xf - 1, yf, zf);
        const n010 = this.grad3(hash(0, 1, 0), xf, yf - 1, zf);
        const n110 = this.grad3(hash(1, 1, 0), xf - 1, yf - 1, zf);

        const n001 = this.grad3(hash(0, 0, 1), xf, yf, zf - 1);
        const n101 = this.grad3(hash(1, 0, 1), xf - 1, yf, zf - 1);
        const n011 = this.grad3(hash(0, 1, 1), xf, yf - 1, zf - 1);
        const n111 = this.grad3(hash(1, 1, 1), xf - 1, yf - 1, zf - 1);

        // Interpolate along X
        const x00 = this.lerp(n000, n100, u);
        const x10 = this.lerp(n010, n110, u);
        const x01 = this.lerp(n001, n101, u);
        const x11 = this.lerp(n011, n111, u);

        // Interpolate along Y
        const y0 = this.lerp(x00, x10, v);
        const y1 = this.lerp(x01, x11, v);

        // Interpolate along Z
        return this.lerp(y0, y1, w);
    }
}
