export default class Navigator {
    constructor() {
        this.ship = null;
    }
    attachTo(ship) {
        this.ship = ship;
    }
    getCommand() {
        this.ship.yaw(10);
    }
}
