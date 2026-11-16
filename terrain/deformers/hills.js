
export default class Hills {

    constructor(options = {}) {

        this.radius = 38;

        // Height
        this.amplitude = 0.75;

        // Wave frequency
        this.frequency = 3;

        // Wave amplitudes
        this.wave1 = 1.5;
        this.wave2 = 1.5;
        this.wave3 = 2.0;

        // Individual wave frequencies
        this.freq1 = 0.25;
        this.freq2 = 0.3;
        this.freq3 = 0.18;

        // Falloff
        this.falloff = 2;

        // Hill centre
        this.centerX = 0;
        this.centerZ = 0;

        // Pattern offset
        this.offsetX = 0;
        this.offsetZ = 0;

        Object.assign(this, options);
    }

    apply(positions) {

        const {
            radius,
            amplitude,
            frequency,
            falloff,
            centerX,
            centerZ,
            offsetX,
            offsetZ
        } = this;

        for (let i = 0; i < positions.count; i++) {

            const x = positions.getX(i);
            const z = positions.getZ(i);

            // Distance from hill centre
            const dx = x - centerX;
            const dz = z - centerZ;

            const distance = Math.sqrt(dx * dx + dz * dz);

            // Normalised distance
            const t = Math.max(0, Math.min(1, 1 - distance / radius));

            // Smooth radial falloff
            const smooth = t * t * (3 - 2 * t);

            const envelope = Math.pow(smooth, falloff);

            // Wave coordinates
            const px = (x + offsetX) * frequency;
            const pz = (z + offsetZ) * frequency;

            // Terrain waves
            let height = 0;

            height += Math.sin(px * this.freq1) * this.wave1;
            height += Math.cos(pz * this.freq2) * this.wave2;
            height += Math.sin((px + pz) * this.freq3) * this.wave3;

            // Final contribution
            height *= amplitude * envelope;

            // Add to existing terrain
            positions.setY(
                i,
                positions.getY(i) + height
            );
        }

        positions.needsUpdate = true;
    }
}
