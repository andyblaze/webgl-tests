import Curve from "./curve.js";

export default class Bend45 extends Curve {
    constructor(three, height = 3) {
        super();

        this.three = three;
        this.height = height;

        const theta = Math.PI / 4;
        const radius = height / theta;

        this.curve = new three.CurvePath();

        // We'll implement getPointAt/getTangentAt ourselves.
        this.theta = theta;
        this.radius = radius;
    }

    getPointAt(t, target) {
        const angle = this.theta * t;
        const r = this.radius;

        target.set(
            r * (1 - Math.cos(angle)),
            r * Math.sin(angle),
            0
        );
        return target;
    }

    getTangentAt(t, target) {
        const angle = this.theta * t;

        target.set(
            Math.sin(angle),
            Math.cos(angle),
            0
        );
        return target.normalize();
    }

}