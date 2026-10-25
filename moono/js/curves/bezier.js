import Curve from "./curve.js";

export default class Bezier extends Curve {
    constructor(three) {
        super();
        this.curve = new three.CubicBezierCurve3(
            new three.Vector3(0, 0, 0),
            new three.Vector3(2, 0.5, 0),
            new three.Vector3(-2, 2.5, 0),
            new three.Vector3(0, 3, 0)
        );
    }
}