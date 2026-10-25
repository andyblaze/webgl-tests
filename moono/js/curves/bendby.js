import Curve from "./curve.js";
import { deg2rad } from "../functions.js";

export default class BendBy extends Curve {
    constructor(three, params) {
        super();

        this.three = three;
        this.height = params.size;

        const theta = deg2rad(params.angle);
        const radius = params.size / theta;

        this.curve = new three.CurvePath();

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