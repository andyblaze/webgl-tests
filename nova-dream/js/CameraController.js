import { Vector3 } from "three";

export default class CameraController {
    constructor(camera, speed = -0.075) {
        this.camera = camera;
        this.speed = speed;
        this.angle = 0;

        this.radius = camera.position.length();
        this.height = camera.position.y;
    }

update(dt) {
    this.angle += this.speed * dt;

    this.camera.position.x =
        Math.sin(this.angle) * this.radius;

    this.camera.position.z =
        Math.cos(this.angle) * this.radius;

    const yaw = Math.sin(this.angle * 0.7) * 0.18;
    const pitch = Math.sin(this.angle * 0.45) * 0.10;

    const direction = new Vector3(
        -this.camera.position.x,
        0,
        -this.camera.position.z
    ).normalize();

    direction.applyAxisAngle(
        new Vector3(0, 1, 0),
        yaw
    );

    const right = new Vector3()
        .crossVectors(direction, new Vector3(0, 1, 0))
        .normalize();

    direction.applyAxisAngle(right, pitch);

    this.camera.lookAt(
        this.camera.position.clone().add(direction)
    );
    const roll = Math.sin(this.angle * 0.35) * 0.12;

this.camera.rotateZ(roll - (this.previousRoll ?? 0));
this.previousRoll = roll;
}
}
