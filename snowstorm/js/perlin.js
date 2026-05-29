export default class Perlin {
    constructor(seed= ) {

        this.seed = seed;
        // cache generated lattice values
        this.values = {};
    }
    // --------------------------------------------------
    // PUBLIC
    // --------------------------------------------------
    sample(x) {
        // surrounding integer positions
        const x0 = Math.floor(x);
        const x1 = x0 + 1;

        // interpolation amount
        const t = x - x0;

        // smooth interpolation curve
        const fadeT = this.fade(t);

        // deterministic random values
        const v0 = this.randomValue(x0);
        const v1 = this.randomValue(x1);

        // interpolate
        return this.lerp(v0, v1, fadeT);
    }
    // --------------------------------------------------
    // INTERNALS
    // --------------------------------------------------
    randomValue(x) {
        // cached?
        if (this.values[x] !== undefined) {
            return this.values[x];
        }
        // deterministic pseudo-random
        let n = x;

        n = (n << 13) ^ n;

        const result =
            1.0 - (
                (
                    n * (
                        n * n * 15731 +
                        789221
                    ) +
                    1376312589 +
                    this.seed
                ) & 0x7fffffff
            ) / 1073741824.0;

        // normalize: -1..1  ->  0..1
        const normalized = (result + 1) * 0.5;

        this.values[x] = normalized;

        return normalized;
    }
    // classic Perlin fade curve
    fade(t) {

        return (
            t * t * t *
            (t * (t * 6 - 15) + 10)
        );
    }
    // linear interpolation
    lerp(a, b, t) {

        return a + (b - a) * t;
    }
}
