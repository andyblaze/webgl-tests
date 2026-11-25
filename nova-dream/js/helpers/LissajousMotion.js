
import { MathUtils } from "three";

export default class LissajouMotion {
    constructor() {
        this.count = 0;
        this.amplitude = 4;
        this.frequencyX = 3;
        this.frequencyY = 2;
        this.frequencyZ = 5;
        this.spread = 0.4;
    }

    init(count, amplitude) {
        this.count = count;
        this.amplitude = amplitude;

        this.positions = new Float32Array(this.count);
        this.phases = new Float32Array(this.count);
        this.speeds = new Float32Array(this.count);
        this.spreads = new Float32Array(this.count);
    }

    setFrequencies(x, y, z) {
        this.frequencyX = x;
        this.frequencyY = y;
        this.frequencyZ = z;
        return this;
    }

    setSpread(spread) {
        this.spread = spread;
        return this;
    }

    create(i) {
        // Distribute particles along the shared curve
        const position = i / this.count;

        // Add a little randomness to avoid perfectly uniform spacing
        this.positions[i] = position + (Math.random() - 0.5) * (1 / this.count);

        // Individual particle phase
        this.phases[i] = Math.random() * Math.PI * 2;

        // Individual particle speed
        this.speeds[i] = MathUtils.lerp(0.13, 0.16, Math.random());

        // Slight variation in distance from the curve
        this.spreads[i] = this.spread * Math.random();
    }

    getAttributes() {
        return {
            motionPosition: { array: this.positions, size: 1 },
            motionPhase: { array: this.phases, size: 1 },
            motionSpeed: { array: this.speeds, size: 1 },
            motionSpread: { array: this.spreads, size: 1 }
        };
    }
}
