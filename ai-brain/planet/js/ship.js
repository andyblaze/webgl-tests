export default class Ship {
    constructor(three) {
        const aspect = window.innerWidth / window.innerHeight;
        this.camera = new three.PerspectiveCamera(60, aspect, 0.1, 10000);
        this.camera.position.set(0, 10, 0);
this.yaw = 0;
this.targetYaw = 0;
this.yawVelocity = 0;
        this.time = 0;
    }
    get actual() {
        return this.camera;
    }
    get position() {
        return this.camera.position;
    }
update(dt) {

    this.time += dt;

    const t = this.time % 24;

    if (t < 8) {
        this.targetYaw = 0;
    }
    else if (t < 16) {
        this.targetYaw = Math.PI / 8;
    }
    else {
        this.targetYaw = 0;
    }

    const maxTurnRate = 0.06;      // radians/sec
    const turnAccel  = 0.03;       // radians/sec²

    const error = this.targetYaw - this.yaw;

    // Desired turn rate
    let targetTurnRate = error * 0.8;

    // Clamp to the ship's maximum turning speed
    targetTurnRate = Math.max(
        -maxTurnRate,
        Math.min(maxTurnRate, targetTurnRate)
    );

    // Accelerate/decelerate towards that turn rate
    const delta = targetTurnRate - this.yawVelocity;
    const maxDelta = turnAccel * dt;

    if (Math.abs(delta) < maxDelta) {
        this.yawVelocity = targetTurnRate;
    }
    else {
        this.yawVelocity += Math.sign(delta) * maxDelta;
    }

    // Apply the turn
    this.yaw += this.yawVelocity * dt;

    this.camera.rotation.y = this.yaw;
}
    setPosition(x, y, z) {

    }
    lookAt(x, y, z) {

    }
}
