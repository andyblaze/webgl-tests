export default class Mind {
    constructor() {
        this.time = 0;
    }
    navigate(dt, ship) {
        this.time += dt; //return;
        // Pitch - slow climb and descent
        let pitchT = this.time % 24;

        if (pitchT < 8) {
            ship.setPitchTarget(0);
        }
        else if (pitchT < 16) {
            ship.setPitchTarget(5);
        }
        else {
            ship.setPitchTarget(0);
        }
        // Yaw - look around
        let yawT = this.time % 37;

        if (yawT < 12) {
            ship.setYawTarget(0);
        }
        else if (yawT < 25) {
            ship.setYawTarget(3);
        }
        else {
            ship.setYawTarget(-5);
        }
        // Roll - gentle banking
        let rollT = this.time % 17;

        if (rollT < 6) {
            ship.setRollTarget(0);
        }
        else if (rollT < 12) {
            ship.setRollTarget(5);
        }
        else {
            ship.setRollTarget(-3);
        }
    }
}
