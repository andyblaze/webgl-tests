import ThreeObj from "../three/three-obj.js";

export default class Sphere extends ThreeObj {
    constructor(three, geo, mat) {
        super();
        const { radius, widthSegments, heightSegments } = geo;
        this.radius = radius;
        this.geometry = new three.SphereGeometry(radius, widthSegments, heightSegments);
        this.material = new three.MeshPhysicalMaterial(mat);
        this.threeObj = new three.Mesh(this.geometry, this.material);
    }
    dimple(depth=0.95) {
        const positions = this.geometry.attributes.position;
        //const radius = this.radius;
        const dimpleRadius = this.radius * 1.1;

        for (let i = 0; i < positions.count; i++) {
            const x = positions.getX(i);
            const y = positions.getY(i);
            const z = positions.getZ(i);

            // Distance from the dimple centre (top of sphere)
            const distance = Math.sqrt(x * x + z * z);

            if (distance < dimpleRadius && y > 0) {
                const falloff = 1 - distance / dimpleRadius;
                positions.setY(i, y - depth * falloff);
            }
        }

        positions.needsUpdate = true;
        this.geometry.computeVertexNormals();

        return this;
    }
}
