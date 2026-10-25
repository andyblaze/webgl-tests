export default class Curve {
    constructor() {}
    getPointAt(t, target) {
        return this.curve.getPointAt(t, target);
    }
    getTangentAt(t, target) {
        return this.curve.getTangentAt(t, target);
    }
}
