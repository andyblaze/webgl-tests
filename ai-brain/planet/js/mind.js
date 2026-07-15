export default class Mind {
    constructor() {
        this.time = 0;
        this.vectors = {
            pitch: { mod: 24, reset: 8, turn: 16, min: 0, max: 5 },
            yaw: { mod: 37, reset: 12, turn: 25, min: -5, max: 3 },
            roll: { mod: 17, reset: 6, turn: 12, min: -3, max: 5}
        };
    }
    getTarget(vector) {
        let tt = this.time % vector.mod;
        return tt < vector.reset ? 0 : (tt < vector.turn ? vector.max : vector.min); 
    }
    pitch(ship, vector) {        
        const t = this.getTarget(vector);
        ship.setPitchTarget(t);
    }
    yaw(ship, vector) {
        const t = this.getTarget(vector);
        ship.setYawTarget(t);
    }
    roll(ship, vector) {
        const t = this.getTarget(vector);
        ship.setRollTarget(t);
    }
    navigate(dt, ship) {
        this.time += dt; 
        this.pitch(ship, this.vectors.pitch);
        this.yaw(ship, this.vectors.yaw);
        this.roll(ship, this.vectors.roll);
    }
}
