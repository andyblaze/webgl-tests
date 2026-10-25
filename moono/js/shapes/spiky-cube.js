import ThreeGroup from "../three/three-group.js";

export default class SpikyCube extends ThreeGroup {

    constructor(three, geo, mat) {
        super(three);

        const { size, spikeRadius, spikeLength } = geo;

        const box = new three.Mesh(
            new three.BoxGeometry(size, size, size),
            new three.MeshPhysicalMaterial(mat)
        );

        const spikeGeometry = new three.CylinderGeometry(
            spikeRadius,
            spikeRadius,
            spikeLength,
            16
        );

        const spikeMaterial = new three.MeshPhysicalMaterial(mat);

        const spikeX = new three.Mesh(spikeGeometry, spikeMaterial);
        spikeX.rotation.z = Math.PI / 2;

        const spikeY = new three.Mesh(spikeGeometry, spikeMaterial);

        const spikeZ = new three.Mesh(spikeGeometry, spikeMaterial);
        spikeZ.rotation.x = Math.PI / 2;

        this.threeObj.add(box);
        this.threeObj.add(spikeX);
        this.threeObj.add(spikeY);
        this.threeObj.add(spikeZ);
    }
}
