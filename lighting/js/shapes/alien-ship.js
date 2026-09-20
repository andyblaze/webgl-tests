import ThreeGroup from "../three/three-group.js";

export default class FlyingSaucer extends ThreeGroup {
    constructor(three, geo, mat) {
        super(three);

        const { radius, widthSegments, heightSegments } = geo;
        const body = new three.Mesh(
            new three.SphereGeometry(radius, widthSegments, heightSegments),
            new three.MeshPhysicalMaterial(mat)
        );
        body.scale.set(1, 0.3, 1);

        const dome = new three.Mesh(
            new three.SphereGeometry(0.8, 32, 16),
            new three.MeshPhysicalMaterial(mat)
        );
        dome.position.y = 0.3;

        this.threeObj.add(body);
        this.threeObj.add(dome);
    }
}
