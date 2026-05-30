export default class Eddy {

    constructor(x, y, radius, maxStrength=0.05) { //strength; // positive = clockwise, negative = anticlockwise

        this.x = x;
        this.y = y;
        this.radius = radius;
        this.strength = 0;
        this.maxStrength = maxStrength;
        this.driftSpeed = 0.1;
        this.lifetime = 55 * 60; // 5s, 60fps 
        this.age = 0;
        this.active = true;
    }
    calcStrengthFromAge() {
        const t = this.age / this.lifetime;

        if ( t >= 1 ) return 0;

        return this.maxStrength * Math.sin(Math.PI * t);
    }
    update() {
        if ( false === this.active ) return;
        this.x += this.driftSpeed;
        this.age++;
        if ( this.age > this.lifetime )
            this.active = false;
        this.strength = this.calcStrengthFromAge();
    }
    // returns wind vector at a position
    sample(px, py) {
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
