import Curve from "./curve.js";

export default class Snake extends Curve {

    constructor(three) {

        super();

        this.curve = new three.CatmullRomCurve3([
            new three.Vector3(0, 0, 0),
            new three.Vector3(1.5, 0.75, 0),
            new three.Vector3(-1.5, 1.5, 0),
            new three.Vector3(1.5, 2.25, 0),
            new three.Vector3(0, 3, 0),
        ]);

    }

}