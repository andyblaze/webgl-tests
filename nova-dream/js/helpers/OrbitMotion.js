import { MathUtils } from "three";

export default class OrbitMotion {
    constructor() {
        this.count = 0;
        this.innerRadius = 0;
        this.outerRadius = 0;
        this.streamCount = 6;
    }
    init(count, innerRadius, outerRadius) {
        this.count = count;
        this.innerRadius = innerRadius;
        this.outerRadius = outerRadius;
        this.radii = new Float32Array(this.count);
        this.angles = new Float32Array(this.count);
        this.inclinations = new Float32Array(this.count);
        this.speeds = new Float32Array(this.count);
        this.phases = new Float32Array(this.count);
    }
    setStreamCount(sc) {
        this.streamCount = sc;
        return this;
    }
    create(i) {
        // Assign each particle to an orbital stream
        const stream = Math.floor(Math.random() * this.streamCount);

        const streamPosition = stream / (this.streamCount - 1);
        const streamRadius = MathUtils.lerp(this.innerRadius, this.outerRadius, streamPosition);

        // Each stream has a slightly different width
        this.radii[i] = streamRadius + (Math.random() - 0.5) * 0.55;

        this.angles[i] = Math.random() * Math.PI * 2;

        // Different orbital inclinations
        const baseInclination = (stream - 2.5) * 0.19;

        this.inclinations[i] = baseInclination + (Math.random() - 0.5) * 0.32;

        // Some particles orbit backwards
        const direction = Math.random() < 0.12 ? -1 : 1;

        this.speeds[i] = direction * MathUtils.lerp(0.12, 0.42, Math.random());

        this.phases[i] = Math.random() * Math.PI * 2;        
    }
    getAttributes() {
        return {
            aRadius: this.radii,
            aAngle: this.angles,
            aInclination: this.inclinations,
            aSpeed: this.speeds,
            aPhase: this.phases
        };
    }
}
