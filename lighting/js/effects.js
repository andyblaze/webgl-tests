export class Orbiter {
    constructor(radius, speed) {
        this.active = false;
        this.orbitCenter = null;
        this.orbitRadius = radius;
        this.orbitSpeed = speed;
        this.orbitAngle = 0;
    }
    start(parent) {
        this.orbitCenter = parent.native.position.clone();
        this.active = true;
        return this;
    }
    stop() {
        this.active = false;
        return this;
    }
    update(parent, dt) {
        if ( false === this.active ) return;
        this.orbitAngle += this.orbitSpeed * dt;
        const ox = this.orbitCenter.x + Math.cos(this.orbitAngle) * this.orbitRadius;
        const oy = this.orbitCenter.y + Math.sin(this.orbitAngle) * this.orbitRadius;
        parent.setPosition(ox, 0, 0);
    }
}

export class LightDimmer {
    constructor(amount, speed) {
        this.active = false;
        this.baseIntensity = 0;
        this.dimmerAmount = amount;
        this.dimmerSpeed = speed;
        this.dimmerTime = Math.PI / 2;
    }
    start(parent) {
        this.baseIntensity = parent.baseIntensity;
        this.active = true;
        return this;
    }
    update(parent, dt) {
        if ( false === this.active ) return;
        this.dimmerTime += dt * this.dimmerSpeed;
        const wave = (Math.sin(this.dimmerTime * Math.PI * 2) + 1) / 2;
        const minIntensity = this.baseIntensity * this.dimmerAmount;
        parent.native.intensity = minIntensity + (this.baseIntensity - minIntensity) * wave;
    }
    stop() {
        this.active = false;
        return this;
    }
}
