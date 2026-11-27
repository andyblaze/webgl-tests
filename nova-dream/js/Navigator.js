class Manoeuvre {
    constructor(duration, commands = {}) {
        this.duration = duration;
        this.commands = commands;
        this.elapsed = 0;
    }
    update(dt, ship) {
        this.elapsed += dt;

        if (this.elapsed >= this.duration) {
            return false;
        }

        this.apply(ship);
        return true;
    }
    apply(ship) {
        const c = this.commands;

        if (c.forward) ship.forward(c.forward);
        if (c.backward) ship.backward(c.backward);
        if (c.yaw) ship.yaw(c.yaw);
        if (c.pitch) ship.pitch(c.pitch);
        if (c.roll) ship.roll(c.roll);
    }
}

export default class Navigator {
    constructor() {
        this.manoeuvres = [
            new Manoeuvre(12, {
                forward: 0.5,
                //yaw: 3,
                //roll: 12,
                pitch: 0.4
            }),
            new Manoeuvre(12, {
                //forward: 2.5,
                yaw: 0.4,
                roll: 0.6,
                //pitch: 6
            }),
            new Manoeuvre(12, {
                //forward: 2.5,
                yaw: -0.4,
                roll: -0.6,
                //pitch: 6
            }),
            new Manoeuvre(12, {
                backward: 0.5,
                //yaw: 3,
                //roll: 12,
                pitch: -0.4
            })
        ];

        this.current = 0;
    }
    attachTo(ship) {
        this.ship = ship;
    }
    update(dt) {
        if (this.current >= this.manoeuvres.length) return;

        const manoeuvre = this.manoeuvres[this.current];

        if (!manoeuvre.update(dt, this.ship)) {
            this.current++;
        }
    }
}