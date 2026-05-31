import { mt_rand, mt_randf } from "./functions.js";

export default class Eddy {

    constructor(x, y, radius, maxStrength=0.05) { // maxStrength - +ve = clockwise, -ve = anticlockwise
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.strength = 0;
        this.maxStrength = maxStrength;
        this.driftSpeed = 0.1; // +ve drifts L -> R,  -ve is R -> L
        this.lifetime = 55 * 60; // 55s, 60fps 
        this.age = 0;
        this.active = false;
    }
    reset() {
        if ( true === this.active ) return;
        this.maxStrength = mt_randf(0.005, 0.007);
        if ( Math.random() < 0.5 )
            this.maxStrength = -this.maxStrength;
        this.x = mt_rand(600, 1200);
        this.y = mt_rand(200, 400);
        this.strength = 0;
        this.lifetime = mt_rand(30, 60) * 60;
        this.driftSpeed = mt_randf(0.05, 0.15);
        if ( Math.random() < 0.5 )
            this.driftSpeed = -this.driftSpeed;
        this.age = 0;
        this.active = true;

    }
    calcStrengthFromAge() {
        const t = this.age / this.lifetime;
        if ( t >= 1 ) return 0;
        return this.maxStrength * Math.sin(Math.PI * t);
    }
    update() {
        this.age++;
        if ( this.age > this.lifetime )
            this.active = false;
        if ( false === this.active ) return;
        this.x += this.driftSpeed;
        this.strength = this.calcStrengthFromAge();
    }
    // returns wind vector at a position
    sample(px, py) {
        if ( false === this.active )
            return { x: 0, y: 0 };
        const dx = px - this.x;
        const dy = py - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // outside influence
        if (dist > this.radius) {
            return { x: 0, y: 0 };
        }
        // normalize distance
        const t = dist / this.radius;

        // falloff: strongest at center, weakest at edge
        const force = (1 - t) * this.strength;

        // perpendicular vector creates rotation
        let vx = -dy;
        let vy = dx;
        // normalize vector
        const len = Math.sqrt(vx * vx + vy * vy);

        if (len > 0) {
            vx /= len;
            vy /= len;
        }
        // apply strength
        vx *= force;
        vy *= force;

        return {
            x: vx,
            y: vy
        };
    }
}
