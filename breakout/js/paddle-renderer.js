import RendererBase from "./renderer-base.js";

export default class PaddleRenderer extends RendererBase {
    constructor(three, width, height) {
        super();
        const geometry = new three.BoxGeometry(width, height, 0.2);
        const material = new three.MeshBasicMaterial({ color: 0xffffff });
        this.mesh = new three.Mesh(geometry, material);
    }
}
