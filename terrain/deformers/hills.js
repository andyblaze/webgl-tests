export default class Hills {
    constructor() {
        this.maxRadius = 18;
        this.falloffRate = 2;
    }
    apply(positions) {
        for ( let i = 0; i < positions.count; i++ ) {

            const x = positions.getX(i);
            const z = positions.getZ(i);

            // Distance from centre
            const distance = Math.sqrt(x*x + z*z);

            // Radial falloff
            const radius = this.maxRadius;
            const falloff = Math.max(0, this.falloffRate - distance / radius);

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
}
