import * as C from "../constants.js";
import EffectBase from "./effect-base.js";

export class Rotater extends EffectBase {
    constructor(speedX=13, speedY=15, speedZ=17) {
        super();
        this.speedX = speedX;
        this.speedY = speedY;
        this.speedZ = speedZ;
    }
    start() {
        return this.init();
    }
    update(parent, time) {
        const dt = time.dt;
        parent.rotate(dt / this.speedX, dt / this.speedY, dt / this.speedZ);
    }
}
export class Orbiter extends EffectBase {
    constructor(radius, speed, plane="z") {
        super();
        this.orbitCenter = null;
        this.orbitRadius = radius;
        this.orbitSpeed = speed;
        this.orbitPlane = plane;

        this.axes = ["x", "y", "z"];
        if ( this.orbitPlane === "y" )
            [this.axes[0], this.axes[1]] = [this.axes[1], this.axes[0]];

        if ( this.orbitPlane === "z" )
            [this.axes[0], this.axes[2]] = [this.axes[2], this.axes[0]];

        this.orbitAngle = 0;
    }
    start(parent) {
        this.orbitCenter = parent.native.position.clone();
        this.orbit = { x: this.orbitCenter.x, y: this.orbitCenter.y, z: this.orbitCenter.z };
        return this.init();
    }
    update(parent, time) {
        if ( this.inactive() ) return;

        this.orbitAngle += this.orbitSpeed * time.dt;

        const offset1 = Math.cos(this.orbitAngle) * this.orbitRadius;
        const offset2 = Math.sin(this.orbitAngle) * this.orbitRadius;

        this.orbit[this.axes[1]] = this.orbitCenter[this.axes[1]] + offset1;
        this.orbit[this.axes[2]] = this.orbitCenter[this.axes[2]] + offset2;

        parent.setPosition(this.orbit.x, this.orbit.y, this.orbit.z);
    }
}

export class ColorCycler extends EffectBase {
    constructor(three, speed) {
        super();
        this.time = 0;
        this.speed = speed;
        this.colors = [
            new three.Color(0xff0000), // red
            new three.Color(0xff00ff), // magenta
            new three.Color(0x0000ff), // blue
            new three.Color(0x00ffff), // cyan
            new three.Color(0x00ff00), // green
            new three.Color(0xffff00), // yellow
        ];
    }
    start(parent) {
        this.time = Math.random();
        return this.init();
    }
    update(parent, time) { //console.log(time);
        if ( this.inactive() ) return;
        this.time += time.dt * this.speed;

        const position = this.time % 1;

        const scaled = position * this.colors.length;
        const index = Math.floor(scaled);
        const t = scaled - index;

        const colour1 = this.colors[index];
        const colour2 = this.colors[(index + 1) % this.colors.length];

        parent.native.color.copy(colour1).lerp(colour2, t);
    }
}

export class LightDimmer extends EffectBase {
    constructor(amount, speed) {
        super();
        this.baseIntensity = 0;
        this.dimmerAmount = amount;
        this.dimmerSpeed = speed;
        this.dimmerTime = C.DEG90;
    }
    start(parent) {
        this.baseIntensity = parent.baseIntensity;
        return this.init();
    }
    update(parent, time) {
        if ( this.inactive() ) return;
        this.dimmerTime += time.dt * this.dimmerSpeed;
        const wave = (Math.sin(this.dimmerTime * C.DEG360) + 1) / 2;
        const minIntensity = this.baseIntensity * this.dimmerAmount;
        parent.native.intensity = minIntensity + (this.baseIntensity - minIntensity) * wave;
    }
}
