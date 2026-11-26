export default class Navigator {
    constructor() {
        this.ship = null;
        this.timer = 0;
    }
    attachTo(ship) {
        this.ship = ship;
    }
    getCommand() {
        if ( parseInt(this.timer) % 3 === 0 ) {
            this.ship.forward(0.2);
            this.ship.roll(2);
            this.ship.yaw(-2);
            this.ship.pitch(2);
        }
        if ( parseInt(this.timer) % 13 === 0 ) {
            this.ship.backward(1.8);
            this.ship.roll(-8);
            this.ship.yaw(8);
            this.ship.pitch(-8);
        }
    }
    update(dt) {
        this.timer += dt;
    }
}
