import Curve from "./curve.js";

export default class CowHorn extends Curve {
    constructor(three) {
        super();
        this.curve = new three.CatmullRomCurve3([
            new three.Vector3(0, 0, 0),
            new three.Vector3(1, 1, 0),
            new three.Vector3(2, 2, 0),
            new three.Vector3(3, 3, 1),
        ]);
    }    
}