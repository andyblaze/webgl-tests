export default class Sheet {

    constructor(x, y, width, maxStrength = 0.008) {

        this.x = x;
        this.y = y; // currently unused, but useful later

        this.width = width;

        this.strength = 0;
        this.maxStrength = maxStrength;

        this.driftSpeed = 2.951;

        this.lifetime = 9 * 60;
        this.age = 0;
        this.active = true;
    }

    reset() {
        // placeholder
    }

    calcStrengthFromAge() {

        const t = this.age / this.lifetime;

        if (t >= 1)
            return 0;

        return this.maxStrength * Math.sin(Math.PI * t);
    }

    update() {

        this.age++;

        if (this.age > this.lifetime)
            this.active = false;

        if (false === this.active)
            return;

        this.x += this.driftSpeed;

        this.strength = this.calcStrengthFromAge();
    }

    sample(px, py) {

        if (false === this.active)
            return { x: 0, y: 0 };

        const dx = px - this.x;

        const halfWidth = this.width * 0.5;
        const dist = Math.abs(dx);

        // outside sheet
        if (dist > halfWidth)
            return { x: 0, y: 0 };

        // 1 at centre, 0 at edge
        const t = dist / halfWidth;

        const force = (1 - t) * this.strength;

        let vx = 0;

        if (dx > 0) {
            // particle right of centreline -> pull left
            vx = force * Math.random();
        }
        else {
            // particle left of centreline -> pull right
            //vx = force;
        }

        return {
            x: vx,
            y: 0
        };
    }
}