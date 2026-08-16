import { ParametricGeometry } from 'three/addons/geometries/ParametricGeometry.js';

export default class MobiusStrip {
    constructor(three) {
        const segmentsU = 200;
        const segmentsV = 40;
        this.geometry = new ParametricGeometry(this.mobius, segmentsU, segmentsV);
        this.geometry.computeVertexNormals();

        this.material = this.makeMaterial(three);

        const mesh = new three.Mesh(this.geometry, this.material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        this.nativeObj = mesh;
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

            roughness: 0.35,
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
