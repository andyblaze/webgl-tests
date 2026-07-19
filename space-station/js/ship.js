import { degToRad } from "./functions.js";

export default class Ship {
    constructor(three, mind) {
        const aspect = window.innerWidth / window.innerHeight;
        this.camera = new three.PerspectiveCamera(60, aspect, 0.1, 10000);
        this.camera.position.set(0, 5, -1);
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
        this.maxTurnRate = 0.06;
        this.turnAccel = 0.03;
        this.errorGain = 0.8;
        this.mind = mind;
    }
    get actual() {
        return this.camera;
    }
    get position() {
        return this.camera.position;
    }
    updateRotation(axis, dt, deg) {

        const error = axis.target - axis.angle;

        let targetVelocity = error * this.errorGain;

        targetVelocity = Math.max(-this.maxTurnRate, Math.min(this.maxTurnRate, targetVelocity));

        const delta = targetVelocity - axis.velocity;
        const maxDelta = this.turnAccel * dt;

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
        /*this.mind.navigate(dt, this);
        this.applyPitch(dt);
        this.applyYaw(dt);
        this.applyRoll(dt);*/
    }
}
