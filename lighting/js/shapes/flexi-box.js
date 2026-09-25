import ThreeObj from "../three/three-obj.js";

export default class FlexiBox extends ThreeObj {
    constructor(three, geo, mat) {
        super();
        const { width, height, depth } = geo;
        this.width = width;
        this.geometry = new three.BoxGeometry(width, height, depth, 64, 64, 64);
        this.material = new three.MeshPhysicalMaterial(mat);
        this.threeObj = new three.Mesh(this.geometry, this.material);
    }
    pullSide(depth=1, radius=1) {
        const positions = this.geometry.attributes.position;

        for ( let i = 0; i < positions.count; i++ ) {
            const x = positions.getX(i);
            const y = positions.getY(i);
            const z = positions.getZ(i);

            // Only affect the +X face
            if ( x > this.width / 2 - 0.001 ) {
                const distance = Math.sqrt(y * y + z * z);

                if ( distance < radius ) {
const t = Math.min(distance / radius, 1);
const falloff = 1 - (t * t * (3 - 2 * t));
                    positions.setX(i, x + depth * falloff);
                }
            }
        }

        positions.needsUpdate = true;
        this.geometry.computeVertexNormals();

        return this;
    }
}
