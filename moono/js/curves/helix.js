import Curve from "./curve.js";

export default class Helix extends Curve {

    constructor(three, height = 3) {
        super();

        this.three = three;
        this.height = height;

        this.turns = 1.5;
        this.radius = 1.0;
    }

    getPointAt(t, target) {

        const angle = Math.PI * 2 * this.turns * t;

        target.set(
            this.radius * Math.cos(angle),
            this.height * t,
            this.radius * Math.sin(angle)
        );

        return target;
    }

    getTangentAt(t, target) {

        const angle = Math.PI * 2 * this.turns * t;
        const scale = Math.PI * 2 * this.turns;

        target.set(
            -this.radius * scale * Math.sin(angle),
            this.height,
            this.radius * scale * Math.cos(angle)
        );

        return target.normalize();
    }
}