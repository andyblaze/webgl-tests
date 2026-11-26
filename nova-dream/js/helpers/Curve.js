import { MathUtils, Vector3, CatmullRomCurve3 } from 'three';

export default class Curve {
    static create(p, phase) {
        const points = [];

        const radiusX = MathUtils.lerp(p.minRadius, p.maxRadius, Math.random()) * 1.3;
        const radiusZ = radiusX * MathUtils.randFloat(0.8, 1.2);

        const verticalOffset = MathUtils.randFloatSpread(p.verticalSpread);

        for (let j = 0; j < p.segments; j++) {
            const t = j / p.segments;
            const angle = t * Math.PI * 2;

            const x = Math.cos(angle) * radiusX;
            const z = Math.sin(angle) * radiusZ;
            const y = verticalOffset + Math.sin(angle * 2 + phase) * 0.25;

            points.push(new Vector3(x, y, z));
        }
        return new CatmullRomCurve3(points, true, 'centripetal');        
    }
}
