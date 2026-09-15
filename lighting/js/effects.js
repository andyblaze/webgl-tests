class EffectBase {
    constructor() {
        this.active = false;
    }
    stop() {
        this.active = false;
        return this;
    }
    inactive() {
        return (false === this.active);
    }
    init() {
        this.active = true;
        return this;        
    }
}
export class Orbiter extends EffectBase {
    constructor(radius, speed, plane="z") {
        super();
        this.orbitCenter = null;
        this.orbitRadius = radius;
        this.orbitSpeed = speed;
        this.orbitPlane = plane;
        this.orbitAngle = 0;
    }
    start(parent) {
        this.orbitCenter = parent.native.position.clone();
        return this.init();
    }
    update(parent, dt) {
        if ( this.inactive() ) return;

        this.orbitAngle += this.orbitSpeed * dt;

        const offset1 = Math.cos(this.orbitAngle) * this.orbitRadius;
        const offset2 = Math.sin(this.orbitAngle) * this.orbitRadius;

        let x = this.orbitCenter.x;
        let y = this.orbitCenter.y;
        let z = this.orbitCenter.z;

        switch (this.orbitPlane) {
            case "x":
                y += offset1;
                z += offset2;
                break;

            case "y":
                x += offset1;
                z += offset2;
                break;

            case "z":
                x += offset1;
                y += offset2;
                break;
        }

        parent.setPosition(x, y, z);
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
    update(parent, dt) {
        if ( this.inactive() ) return;
        this.time += dt * this.speed;

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
        this.dimmerTime = Math.PI / 2;
    }
    start(parent) {
        this.baseIntensity = parent.baseIntensity;
        return this.init();
    }
    update(parent, dt) {
        if ( this.inactive() ) return;
        this.dimmerTime += dt * this.dimmerSpeed;
        const wave = (Math.sin(this.dimmerTime * Math.PI * 2) + 1) / 2;
        const minIntensity = this.baseIntensity * this.dimmerAmount;
        parent.native.intensity = minIntensity + (this.baseIntensity - minIntensity) * wave;
    }
}
