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
    reset() {
        this.elapsed = 0;
    }
    apply(ship) {
        const c = this.commands;

        if (c.forward) ship.forward(c.forward);
        if (c.backward) ship.backward(c.backward);
        if (c.yaw) ship.yaw(c.yaw);
        if (c.pitch) ship.pitch(c.pitch);
        if (c.roll) ship.roll(c.roll);
        if (c.stop) ship.stop();
        if (c.start) ship.start();
        if (c.enterOrbit) ship.enterOrbit();
        if (c.leaveOrbit) ship.leaveOrbit();
    }
}

export default class Navigator {
    constructor() {
        this.manoeuvres = [
            new Manoeuvre(15, {
                enterOrbit: 1
            }),
            new Manoeuvre(5, {
                leaveOrbit: 1
            }),
            new Manoeuvre(5, {
                yaw:4
            }),
            new Manoeuvre(1, {
                stop: 1
            }),
            new Manoeuvre(1, {
                start: 1
            }),
            new Manoeuvre(5, {
                yaw:-4
            }),
            new Manoeuvre(1, {
                stop: 1
            }),
            new Manoeuvre(1, {
                start: 1
            })
            /*,
            new Manoeuvre(12, {
                forward: 1,
                //yaw: 3,
                roll: 0.6,
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
            new Manoeuvre(3, {
                stop: 1
            }),
            new Manoeuvre(3, {
                start: 1
            }),
            new Manoeuvre(12, {
                backward: 1,
                //yaw: 3,
                roll: -0.6,
                pitch: -0.4
            }),
            new Manoeuvre(3, {
                stop: 1
            }),
            new Manoeuvre(3, {
                start: 1
            })*/
        ];

        this.current = 0;
    }
    attachTo(ship) {
        this.ship = ship;
    }
    update(dt) {
        if (this.current >= this.manoeuvres.length) {
            for ( const m of this.manoeuvres ) 
                m.reset();
        this.current = 0;
        }

        const manoeuvre = this.manoeuvres[this.current];

        if (!manoeuvre.update(dt, this.ship)) {
            this.current++;
        }
    }
}