import * as THREE from 'three';

export default class TubeGeometry {
    static create(curve, segments, radialSegments,
        thickness, strandIndex, phase) {

        const frames = curve.computeFrenetFrames(segments, false);

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
            const taper = Math.sin(Math.PI * t);

            const organicWidth =
                0.85 + 0.15 * Math.sin(t * 18.0 + phase);

            const radius = thickness *
                (0.35 + taper * 0.65) *
                organicWidth;

            const normal = frames.normals[i];
            const binormal = frames.binormals[i];

            for (let j = 0; j <= radialSegments; j++) {

                const angle =
                    (j / radialSegments) * Math.PI * 2;

                const radial = new THREE.Vector3()
                    .copy(normal)
                    .multiplyScalar(Math.cos(angle))
                    .addScaledVector(
                        binormal,
                        Math.sin(angle)
                    );

                const vertex = new THREE.Vector3()
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

        const geometry = new THREE.BufferGeometry();

        geometry.setAttribute(
            'position',
            new THREE.Float32BufferAttribute(positions, 3)
        );

        geometry.setAttribute(
            'aProgress',
            new THREE.Float32BufferAttribute(progress, 1)
        );

        geometry.setAttribute(
            'aStrand',
            new THREE.Float32BufferAttribute(strand, 1)
        );

        geometry.setAttribute(
            'aPhase',
            new THREE.Float32BufferAttribute(phases, 1)
        );

        geometry.setIndex(indices);

        geometry.computeVertexNormals();
        geometry.computeBoundingSphere();

        return geometry;
    }
}
