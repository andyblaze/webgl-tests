import { Vector3, BufferGeometry, Float32BufferAttribute } from "three";

export default class TubeGeometry {
    static create(curve, segments, radialSegments,
        thickness, strandIndex, phase) {

        const frames = curve.computeFrenetFrames(segments, true);

        const positions = [];
        const progress = [];
        const strand = [];
        const phases = [];
        const indices = [];

        const count = strandIndex;

        for (let i = 0; i <= segments; i++) {
            const t = i / segments;

            const point = curve.getPointAt(t);

            // Slightly tapered, irregular strand thickness
            const organicWidth = 0.9 + 0.1 * Math.sin(t * Math.PI * 6.0 + phase);

            const radius = thickness * organicWidth;

            const normal = frames.normals[i];
            const binormal = frames.binormals[i];

            for (let j = 0; j <= radialSegments; j++) {

                const angle =
                    (j / radialSegments) * Math.PI * 2;

                const radial = new Vector3()
                    .copy(normal)
                    .multiplyScalar(Math.cos(angle))
                    .addScaledVector(
                        binormal,
                        Math.sin(angle)
                    );

                const vertex = new Vector3()
                    .copy(point)
                    .addScaledVector(radial, radius);

                positions.push(
                    vertex.x,
                    vertex.y,
                    vertex.z
                );

                progress.push(t);
                strand.push(count);
                phases.push(phase);
            }
        }

        // Connect the tube rings
        for (let i = 0; i < segments; i++) {

            for (let j = 0; j < radialSegments; j++) {

                const a =
                    i * (radialSegments + 1) + j;

                const b = a + radialSegments + 1;

                indices.push(
                    a, b, a + 1,
                    b, b + 1, a + 1
                );
            }
        }

        const geometry = new BufferGeometry();

        geometry.setAttribute(
            'position',
            new Float32BufferAttribute(positions, 3)
        );

        geometry.setAttribute(
            'aProgress',
            new Float32BufferAttribute(progress, 1)
        );

        geometry.setAttribute(
            'aStrand',
            new Float32BufferAttribute(strand, 1)
        );

        geometry.setAttribute(
            'aPhase',
            new Float32BufferAttribute(phases, 1)
        );

        geometry.setIndex(indices);

        geometry.computeVertexNormals();
        geometry.computeBoundingSphere();

        return geometry;
    }
}
