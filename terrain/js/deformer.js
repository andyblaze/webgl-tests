export default class Deformer {
    constructor(p) {
        this.perlin = p;
    }
    singleMountain(positions) {
        for (let i = 0; i < positions.count; i++) {

            const x = positions.getX(i);
            const z = positions.getZ(i);

            // Distort the mountain's radius by direction
            const angle = Math.atan2(z, x);

            const radius =
                13 +
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

            const height = Math.max(
                0,
                Math.pow(falloff, 2) * 12 +
                variation// * falloff
            );

            positions.setY(i, height);
        }
    }
    sineWave(positions) {
        for ( let i = 0; i < positions.count; i++ ) {

            const x = positions.getX(i);
            const z = positions.getZ(i);

            // Distance from centre
            const distance = Math.sqrt(x*x + z*z);

            // Radial falloff
            const radius = 18;
            const falloff = Math.max(0, 2 - distance / radius);

            // Original terrain waves
            let height = 0;

            height += Math.sin(x * 0.25) * 1.5;
            height += Math.cos(z * 0.3) * 1.5;
            height += Math.sin((x + z) * 0.18) * 2.0;

            // Apply falloff
            height *= falloff;

            positions.setY(i, height);
        }
    }
    noise = (positions) => {
        const scale = 0.16;
        const amplitude = 3;

        for (let i = 0; i < positions.count; i++) {

            const x = positions.getX(i);
            const z = positions.getZ(i);

            const height = this.perlin.noise(x * scale, z * scale);

            positions.setY(i, positions.getY(i) + height * amplitude);
        }
    };
}
