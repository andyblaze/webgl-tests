export default class Mountain {
    constructor() {
        this.maxRadius = 13;
        this.maxHeight = 8;
    }
    apply(positions) {
        for (let i = 0; i < positions.count; i++) {

            const x = positions.getX(i);
            const z = positions.getZ(i);

            // Distort the mountain's radius by direction
            const angle = Math.atan2(z, x);

            const radius =
                this.maxRadius +
                Math.sin(angle * 2) * 3 +
                Math.cos(angle * 3) * 2 +
                Math.sin(angle * 5) * 1.5;

            // Slightly irregular peak position
            const dx = x - 1.5;
            const dz = z + 1.0;

            const distance = Math.sqrt(dx * dx + dz * dz);

            const falloff = Math.max(0, 1 - distance / radius);

            // Add some unevenness to the slopes
            const variation =
                Math.sin(x * 0.3 + z * 0.2) * 0.8 +
                Math.cos(z * 0.4 - x * 0.15) * 0.6;

            const height = Math.max(0, Math.pow(falloff, 2) * this.maxHeight + variation);

            positions.setY(i, height);
        }
    }
}
