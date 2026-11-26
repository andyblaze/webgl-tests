import { Vector3, MathUtils } from "three";

export default class Ship {
    constructor(camera, navigator, speed = -0.075) {
        this.camera = camera;
        this.speed = speed;
        this.navigator = navigator;
        this.navigator.attachTo(this);
        this.angle = 0;

        this.radius = camera.position.length();
        this.height = camera.position.y;

this.yawAngle = 0;
this.targetYaw = 0;
this.damping = 2.0;
    }
    yaw(degrees) {
        //this.yawVelocity += MathUtils.degToRad(degrees);
        //this.targetYawVelocity = MathUtils.degToRad(degrees);
        this.targetYaw += MathUtils.degToRad(degrees);
    }
update(dt) {
    this.navigator.getCommand(dt);

    this.yawAngle = MathUtils.damp(
        this.yawAngle,
        this.targetYaw,
        this.damping,
        dt
    );

    this.camera.rotation.y = this.yawAngle;
}
}
