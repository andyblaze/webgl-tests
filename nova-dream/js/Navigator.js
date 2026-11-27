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
            new Manoeuvre(3, {
                forward: 1.5,
                //yaw: 3,
                //roll: 12,
                pitch: 4
            }),
            new Manoeuvre(6, {
                //forward: 2.5,
                yaw: 4,
                roll: 6,
                //pitch: 6
            }),
            new Manoeuvre(6, {
                //forward: 2.5,
                yaw: -4,
                roll: -6,
                //pitch: 6
            }),
            new Manoeuvre(3, {
                backward: 1.5,
                //yaw: 3,
                //roll: 12,
                pitch: -4
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
/*export default class Navigator {
    constructor() {
        this.ship = null;
        this.timer = 0;
    }
    attachTo(ship) {
        this.ship = ship;
    }
    getCommand() {
        //this.ship.forward(0.2);
        //this.ship.yaw(0.15);
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
}*/
