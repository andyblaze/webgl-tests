import { MathUtils, Vector3, CatmullRomCurve3 } from 'three';

export default class Curve {
    static create(p, phase) {
        const turns = p.turns * MathUtils.lerp(
            0.7,
            1.5,
            Math.random()
        );

        const wobble = MathUtils.lerp(
            0.12,
            0.38,
            Math.random()
        );

        // Orbital plane: X and Z
        const baseRadius = MathUtils.lerp(
            p.minRadius,
            p.maxRadius,
            Math.random()
        );

        const orbitWidth = MathUtils.randFloat(2.5, 6.1);

        const verticalOffset = MathUtils.randFloatSpread(0.7);
        const verticalWave = MathUtils.randFloat(0.12, 0.35);
        const orbitPhase = Math.random() * Math.PI * 2;

        const points = [];

        // Generate an extended elliptical spiral
        for ( let j = 0; j <= p.segments; j++ ) {

            const t = j / p.segments;

            const angle = orbitPhase + t * Math.PI * 2 * turns;

            // Gradual expansion and contraction
            const envelope = Math.sin(Math.PI * t);

            const radius =
                baseRadius +
                orbitWidth * envelope +
                Math.sin(angle * 2.0 + phase) * wobble;

            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius * 0.85;

            // Keep vertical movement subtle
            const y =
                verticalOffset +
                Math.sin(angle * 0.5 + phase) *
                verticalWave;

            points.push(new Vector3(x, y, z));
        }
        return new CatmullRomCurve3(points, true, 'centripetal');
    }
}
