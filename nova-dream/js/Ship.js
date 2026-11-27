import { Vector3, MathUtils } from "three";

class Motion {
    constructor() {
        this.angle = 0;
        this.target = 0;
        this.damping = 3;
    }
    move(degrees) {
        this.target += MathUtils.degToRad(degrees);
    }
    update(dt) {
        this.angle = MathUtils.damp(
            this.angle,
            this.target,
            this.damping,
            dt
        );
    }
}
class Yaw extends Motion {
    constructor() {
        super();
    }
}
class Pitch extends Motion {
    constructor() {
        super();
    }
}
class Roll extends Motion {
    constructor() {
        super();
    }
}
class Thrust {
    constructor() {
        this.velocity = 0;
        this.acceleration = 0;
        this.damping = 1.5;
        this.maxSpeed = 2;
    }
    move(amount) {
        this.acceleration = amount;
    }
    update(dt) {
        this.velocity += this.acceleration * dt;

        this.velocity = MathUtils.clamp(
            this.velocity,
            -this.maxSpeed,
            this.maxSpeed
        );

        this.velocity *= Math.exp(-this.damping * dt);

        this.acceleration = 0;
    }
}

class Motions {
    constructor() {
        this.motions = {
            yaw: new Yaw(),
            pitch: new Pitch(),
            roll: new Roll()
        };
        this.thrust = new Thrust();
    }
    update(dt) {
        this.motions.yaw.update(dt);
        this.motions.pitch.update(dt);
        this.motions.roll.update(dt);   
        this.thrust.update(dt);     
    }
    yawBy(degrees) {
        this.motions.yaw.move(MathUtils.degToRad(degrees));
    }
    pitchBy(degrees) {
        this.motions.pitch.move(MathUtils.degToRad(degrees));
    }
    rollBy(degrees) {
        this.motions.roll.move(MathUtils.degToRad(degrees));
    }
    get yaw() {
        return this.motions.yaw.angle;
    }
    get pitch() {
        return this.motions.pitch.angle;
    }
    get roll() {
        return this.motions.roll.angle;
    }
}

export default class Ship {
    constructor(camera, navigator, speed = -0.075) {
        this.camera = camera;
        this.speed = speed;
        this.navigator = navigator;
        this.navigator.attachTo(this);
        this.motions = new Motions();
        this.angle = 0;

        this.radius = camera.position.length();
        this.height = camera.position.y;
    }
    yaw(degrees) {
        this.motions.yawBy(degrees);
    }
    pitch(degrees) {
        this.motions.pitchBy(degrees);
    }
    roll(degrees) {
        this.motions.rollBy(degrees);
    }
    forward(distance) {
        this.motions.thrust.move(distance);
    }
    backward(distance) {
        this.motions.thrust.move(-distance);
    }   
    update(dt) {
        this.navigator.update(dt);
        this.motions.update(dt);

        this.camera.rotation.y = this.motions.yaw;
        this.camera.rotation.x = this.motions.pitch;
        this.camera.rotation.z = this.motions.roll;
        this.camera.translateZ(-this.motions.thrust.velocity * dt);
    }
}
