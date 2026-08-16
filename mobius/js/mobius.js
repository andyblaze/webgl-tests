import { ParametricGeometry } from 'three/addons/geometries/ParametricGeometry.js';

export default class MobiusStrip {
    constructor(three) {
        const segmentsU = 200;
        const segmentsV = 40;
        this.geometry = this.createSurfaceGeometry2(three, segmentsU, segmentsV);
        /*this.geometry = this.createGeometry(
            three, 
            { radius: 1, width: 0.35, thickness: 0.06, segmentsU: 200, segmentsV: 40 }
        ); //new ParametricGeometry(this.mobius, segmentsU, segmentsV);*/
        this.geometry.computeVertexNormals();

        this.material = this.makeMaterial(three);

        const mesh = new three.Mesh(this.geometry, this.material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        this.nativeObj = mesh;
    }
    createSurfaceGeometry(three, segmentsU, segmentsV) {
        const geometry = new three.BufferGeometry();

        const positions = [];
        const uvs = [];
        const indices = [];

        const major = 1.25;
        const width = 0.35;

        // 6 mm if scene units are metres.
        const thickness = 0.06;

        const halfThickness = thickness * 0.5;

        const rowSize = segmentsV + 1;


        // -------------------------------------------------------------------------
        // Möbius point + surface normal
        // -------------------------------------------------------------------------

        function getPoint(u, v, depth = 0) {

            const U = u * Math.PI * 2;
            const V = (v - 0.5) * 2;

            const halfU = U * 0.5;

            const cosU = Math.cos(U);
            const sinU = Math.sin(U);

            const cosHalfU = Math.cos(halfU);
            const sinHalfU = Math.sin(halfU);

            // Original Möbius surface.
            const x = (major + V * width * cosHalfU) * cosU;
            const y = (major + V * width * cosHalfU) * sinU;
            const z = V * width * sinHalfU;

            // ---------------------------------------------------------------------
            // Normal of the Möbius surface.
            //
            // This is the direction in which we offset the two metal faces.
            // ---------------------------------------------------------------------

            let nx = cosHalfU * cosU;
            let ny = cosHalfU * sinU;
            let nz = sinHalfU;

            const length = Math.sqrt(nx * nx + ny * ny + nz * nz);

            nx /= length;
            ny /= length;
            nz /= length;

            return { x: x + nx * depth, y: y + ny * depth, z: z + nz * depth };
        }


        // -------------------------------------------------------------------------
        // Add a vertex.
        //
        // side:
        //
        //   0 = top
        //   1 = bottom
        // -------------------------------------------------------------------------

        function addVertex(u, v, side) {
            const depth = side === 0 ? halfThickness : -halfThickness;

            const p = getPoint(u, v, depth);

            const index = positions.length / 3;

            positions.push(p.x, p.y, p.z);

            // Keep UVs on both surfaces.
            uvs.push(u, v);

            return index;
        }


        // -------------------------------------------------------------------------
        // Generate top and bottom surfaces.
        // -------------------------------------------------------------------------

        for (let side = 0; side < 2; side++) {

            for (let i = 0; i <= segmentsU; i++) {

                const u = i / segmentsU;

                for (let j = 0; j <= segmentsV; j++) {

                    const v = j / segmentsV;


                    addVertex(u, v, side);
                }
            }
        }


        // -------------------------------------------------------------------------
        // Index helper.
        // -------------------------------------------------------------------------

        const surfaceOffset = (segmentsU + 1) * rowSize;

        function index(side, i, j) {
            return (side * surfaceOffset + i * rowSize + j);
        }


        // -------------------------------------------------------------------------
        // TOP + BOTTOM
        // -------------------------------------------------------------------------

        for (let i = 0; i < segmentsU; i++) {

            for (let j = 0; j < segmentsV; j++) {

                const a = index(0, i, j);
                const b = index(0, i + 1, j);
                const c = index(0, i, j + 1);
                const d = index(0, i + 1, j + 1);


                // Top.
                indices.push(a, b, c, b, d, c);

                const A = index(1, i, j);
                const B = index(1, i + 1, j);
                const C = index(1, i, j + 1);
                const D = index(1, i + 1, j + 1);


                // Bottom – opposite winding.
                indices.push(A, C, B, B, C, D);
            }
        }


        // -------------------------------------------------------------------------
        // EDGE WALLS
        //
        // These give the Möbius its actual physical thickness.
        //
        // There are two parameter-space edges:
        //
        //     v = 0
        //     v = 1
        //
        // which together form the single boundary loop.
        // -------------------------------------------------------------------------

        for (let i = 0; i < segmentsU; i++) {

            const next = i + 1;
            // ---------------------------------------------------------------------
            // v = 0
            // ---------------------------------------------------------------------

            {
                const a = index(0, i, 0);
                const b = index(0, next, 0);
                const c = index(1, i, 0);
                const d = index(1, next, 0);

                indices.push(a, c, b, b, c, d);
            }


            // ---------------------------------------------------------------------
            // v = 1
            // ---------------------------------------------------------------------

            {
                const a = index(0, i, segmentsV);
                const b = index(0, next, segmentsV);
                const c = index(1, i, segmentsV);
                const d = index(1, next, segmentsV);

                indices.push(a, b, c, b, d, c);
            }
        }

        // -------------------------------------------------------------------------
        // Upload.
        // -------------------------------------------------------------------------

        geometry.setAttribute(
            "position",
            new three.Float32BufferAttribute(positions, 3)
        );

        geometry.setAttribute(
            "uv",
            new three.Float32BufferAttribute(uvs, 2)
        );

        geometry.setIndex(indices);
        geometry.computeVertexNormals();
        geometry.computeBoundingBox();
        geometry.computeBoundingSphere();

        return geometry;
    }
    makeGeometry() {
        const segmentsU = 200;
        const segmentsV = 40;
        return new ParametricGeometry(this.mobius, segmentsU, segmentsV);       
    }
    mobius(u, v, target) {
        const twoPi = Math.PI * 2;
        const U = u * twoPi; // angle around
        const V = (v - 0.5) * 2; // -1 .. 1
        const major = 1.25; // radius
        const width = 0.35; // half-width scaling

        // Standard Möbius strip param
        const x = (major + (V * width) * Math.cos(U / 2)) * Math.cos(U);
        const y = (major + (V * width) * Math.cos(U / 2)) * Math.sin(U);
        const z = (V * width) * Math.sin(U / 2);

        target.set(x, y, z);
    }
    makeMaterial(three) {
        const loader = new three.TextureLoader();
        const normMap = loader.load("./textures/cloud-normal.png");
        const roughMap = loader.load("./textures/marble.png");

        normMap.wrapS = three.RepeatWrapping;
        normMap.wrapT = three.RepeatWrapping;

        const material = new three.MeshPhysicalMaterial({
            vertexColors: true,
            side: three.DoubleSide,
            color: 0x40FFFF,

            //transparent: true,
            //opacity: 0.5,

            roughness: 0.735,
            roughnessMap: roughMap,
            metalness: 0.5,
            normalMap: normMap,
            normalScale: new three.Vector2(6, 6),
            emissive:0x1EDCDA,
            emissiveIntensity:0.5,
            clearcoat: 1,
            clearcoatRoughness: 0.5,
            anisotropy: 1
        });
        return material;
    }
    update(dt, elapsed) {
        this.nativeObj.rotation.x += 0.001;
        this.nativeObj.rotation.y += 0.003;
        this.nativeObj.rotation.z += 0.007;
    }
    get native() {
        return this.nativeObj;
    }
}
