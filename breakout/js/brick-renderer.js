import RendererBase from "./renderer-base.js";

export default class BrickRenderer extends RendererBase {
    constructor(three, width, height) {
        super();
        const geometry = new three.BoxGeometry(width, height, 0.2);
        const material = new three.MeshBasicMaterial({ color: 0xffffff });
        //const edgeMaterial = new three.LineBasicMaterial({ color: 0x000000 });
        //const edges = new three.LineSegments( new three.EdgesGeometry(geometry), edgeMaterial);
        this.mesh = new three.Mesh(geometry, material);
        //this.mesh.add(edges);
    }
}  
