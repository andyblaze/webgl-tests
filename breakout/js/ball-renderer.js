import RendererBase from "./renderer-base.js";

export default class BallRenderer extends RendererBase {
    constructor(three, radius) {
        super();
        const geometry = new three.SphereGeometry(radius, 32, 32);
        const material = new three.MeshBasicMaterial({ color: 0xffffff });
        this.mesh = new three.Mesh(geometry, material);
    }
}
