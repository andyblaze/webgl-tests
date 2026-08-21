export default class GearShaft {
    constructor(three) {
        this.shaft = new three.Group();
    }
    attach(gear) {
        this.shaft.add(gear);
    }
    update() {

    }
}