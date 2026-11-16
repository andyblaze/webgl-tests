
import { mt_rand } from "../js/functions.js";
export default class Hills {

    constructor(options = {}) {

        this.maxRadius = 36;

        // Overall terrain
        this.height = 1;
        this.frequency = 0.25;
        this.amplitude = 1.25;

        // Falloff
        this.falloffRate = 1;
        this.falloffPower = 2;

        // Procedural waves
        this.seed = mt_rand();
        this.waveCount = 10;

        this.frequencyMin = 0.15;
        this.frequencyMax = 0.7;

        this.amplitudeMin = 0.5;
        this.amplitudeMax = 2.0;

        // Additional detail
        this.roughness = 3;
        this.roughnessWaves = 6;

        // Pattern positioning
        this.offsetX = 0;
        this.offsetZ = 0;

        Object.assign(this, options);

        // Initialise seeded random generator
        this._seed = this.seed >>> 0;

        // Generate wave configuration once
        this.waves = this.generateWaves();
    }
    // ------------------------------------------------
    // Random number between low and high
    // ------------------------------------------------
    mt_randf(low, high) {
        let t = this._seed += 0x6D2B79F5;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        const random = ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        return low + random * (high - low);
    }
    // ------------------------------------------------
    // Generate procedural waves
    // ------------------------------------------------
    generateWaves() {
        const waves = [];
        // Main rolling waves
        for (let i = 0; i < this.waveCount; i++) {
            waves.push({
                frequency: this.mt_randf(
                    this.frequencyMin,
                    this.frequencyMax
                ),
                amplitude: this.mt_randf(
                    this.amplitudeMin,
                    this.amplitudeMax
                ),
                angle: this.mt_randf(0, Math.PI * 2),
                phase: this.mt_randf(0, Math.PI * 2)
            });
        }
        // Smaller, higher-frequency details
        for (let i = 0; i < this.roughnessWaves; i++) {
            waves.push({
                frequency: this.mt_randf(1.0, 3.0),
                amplitude: this.mt_randf(0.1, 0.35) * this.roughness,
                angle: this.mt_randf(0, Math.PI * 2),
                phase: this.mt_randf(0, Math.PI * 2)
            });
        }
        return waves;
    }
    // ------------------------------------------------
    // Apply terrain
    // ------------------------------------------------
    apply(positions) {
        const { 
            maxRadius, height, frequency, amplitude,
            falloffRate, falloffPower, offsetX, offsetZ
        } = this;

        for (let i = 0; i < positions.count; i++) {
            const x = positions.getX(i);
            const z = positions.getZ(i);

            // Distance from centre
            const distance = Math.sqrt(x*x + z*z);

            // Radial falloff
            const t = Math.max(0, 1 - distance / maxRadius);

            const falloff = Math.pow(t, falloffPower);

            // Wave coordinates
            const px = x + offsetX;
            const pz = z + offsetZ;

            let terrain = 0;

            // Combine procedural waves
            for (const wave of this.waves) {
                const dx = Math.cos(wave.angle);
                const dz = Math.sin(wave.angle);

                const v = px * dx + pz * dz;

                terrain += Math.sin(
                    v * wave.frequency * frequency + wave.phase
                ) * wave.amplitude;
            }

            // Final height contribution
            const finalHeight =
                terrain *
                amplitude *
                height *
                falloff *
                falloffRate;

            //if ( finalHeight < 0 ) finalHeight = 0;

            positions.setY(i, positions.getY(i) + finalHeight);
        }
        //positions.needsUpdate = true;
    }
}
