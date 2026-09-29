import ThreeObj from "../three/three-obj.js";

export default class Wedge extends ThreeObj {
    constructor(three, geo, mat) {
        super();
        const { length } = geo;
        //this.geometry = new three.DodecahedronGeometry(radius, detail);
        this.material = new three.MeshPhysicalMaterial(mat);
        //this.threeObj = new three.Mesh(this.geometry, this.material);
        //const length = 2;
        const halfLength = length / 2;
        const height = Math.sqrt(3) / 2 * length;
        const offset = height / 3;

        const shape = new three.Shape();

        shape.moveTo(-halfLength, -offset);
        shape.lineTo(halfLength, -offset);
        shape.lineTo(0, height - offset);
        shape.lineTo(-halfLength, -offset);

        this.geometry = new three.ExtrudeGeometry(shape, { depth: 0.25 });

        //this.material = new three.MeshBasicMaterial({ color: 0x00ff00 });

        this.threeObj = new three.Mesh(this.geometry, this.material);        
    }
}
