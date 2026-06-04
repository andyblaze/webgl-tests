import { mt_rand, mt_randf } from "./functions.js";

export default class Gust {

    constructor(cfg) {
        this.cfg = cfg;
        this.x = 0;
        this.y = 0; // currently unused, but useful later

        this.width = 0;
        this.height = 0;

        this.strength = 0;
        this.maxStrength = 0;

        this.driftSpeed = 0;

        this.lifetime = 0;
        this.age = 0;
        this.active = false;
    }

    reset() {
        if ( true === this.active ) return;
        this.maxStrength = mt_randf(0.005, 0.01);
        this.x = mt_rand(6, 120);
        this.y = mt_rand(20, 100);
        this.width = mt_rand(360, 400);
        this.height = mt_rand(100, 600);
        this.strength = 0;
        this.lifetime = mt_rand(6, 10) * 60;
        this.driftSpeed = mt_randf(1.5, 2.5);
        this.age = 0;
        this.active = true;
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
        const dy = py - this.y;

        const halfWidth = this.width * 0.5;
        const distX = Math.abs(dx);
        const distY = Math.abs(dy);

        // outside sheet
        if ( distY < this.y || distY > this.y + this.height )
            return { x: 0, y: 0 };
        if ( distX > halfWidth )
            return { x: 0, y: 0 };

        // 1 at centre, 0 at edge
        const t = distX / halfWidth;

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