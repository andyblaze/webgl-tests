function degToRad(deg) {
    return deg * Math.PI / 180;
}

class Mind {
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

export default class Ship {
    constructor(three) {
        const aspect = window.innerWidth / window.innerHeight;
        this.camera = new three.PerspectiveCamera(60, aspect, 0.1, 10000);
        this.camera.position.set(0, 10, 0);
        this.yaw = {
            angle: 0,
            target: 0,
            velocity: 0
        };
        this.pitch = {
            angle: 0,
            target: 0,
            velocity: 0
        };
        this.roll = {
            angle: 0,
            target: 0,
            velocity: 0
        };
        this.mind = new Mind();
    }
    get actual() {
        return this.camera;
    }
    get position() {
        return this.camera.position;
    }
    updateRotation(axis, dt, deg) {

        const maxTurnRate = 0.06;
        const turnAccel = 0.03;
        const errorGain = 0.8;

        const error = axis.target - axis.angle;

        let targetVelocity = error * errorGain;

        targetVelocity = Math.max(
            -maxTurnRate,
            Math.min(maxTurnRate, targetVelocity)
        );

        const delta = targetVelocity - axis.velocity;
        const maxDelta = turnAccel * dt;

        if (Math.abs(delta) < maxDelta) {
            axis.velocity = targetVelocity;
        }
        else {
            axis.velocity += Math.sign(delta) * maxDelta;
        }

        axis.angle += axis.velocity * dt;
    }
    applyYaw(dt) {
        this.updateRotation(this.yaw, dt);
        this.camera.rotation.y = this.yaw.angle;
    }

    applyPitch(dt) {
        this.updateRotation(this.pitch, dt);
        this.camera.rotation.x = this.pitch.angle;
    }

    applyRoll(dt) {
        this.updateRotation(this.roll, dt);
        this.camera.rotation.z = this.roll.angle;
    }
    setYawTarget(deg) {
        this.yaw.target = degToRad(deg);
    }
    setPitchTarget(deg) {
        this.pitch.target = degToRad(deg);
    }
    setRollTarget(deg) {
        this.roll.target = degToRad(deg);
    }
    update(dt) {
        this.mind.navigate(dt, this);
        this.applyPitch(dt);
        this.applyYaw(dt);
        this.applyRoll(dt);
    }
}
