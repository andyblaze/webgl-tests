function degToRad(deg) {
    return deg * Math.PI / 180;
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
        this.time = 0;
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
update(dt) {

    this.time += dt; //return;

    //
    // Pitch - slow climb and descent
    //
    let pitchT = this.time % 24;

    if (pitchT < 8) {
        this.pitch.target = degToRad(0);
    }
    else if (pitchT < 16) {
        this.pitch.target = degToRad(15);
    }
    else {
        this.pitch.target = degToRad(0);
    }


    //
    // Yaw - look around
    //
    let yawT = this.time % 37;

    if (yawT < 12) {
        this.yaw.target = degToRad(0);
    }
    else if (yawT < 25) {
        this.yaw.target = degToRad(20);
    }
    else {
        this.yaw.target = degToRad(-10);
    }


    //
    // Roll - gentle banking
    //
    let rollT = this.time % 17;

    if (rollT < 6) {
        this.roll.target = degToRad(0);
    }
    else if (rollT < 12) {
        this.roll.target = degToRad(5);
    }
    else {
        this.roll.target = degToRad(-3);
    }


    this.applyPitch(dt);
    this.applyYaw(dt);
    this.applyRoll(dt);
}
}
