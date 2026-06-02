import { mt_rand, mt_randf } from "./functions.js";

export default class Eddy {

    constructor(cfg) { 
        this.cfg = cfg;
        this.x = 0;
        this.y = 0;
        this.radius = 0;
        this.strength = 0;
        this.maxStrength = 0;
        this.driftSpeed = 0; 
        this.lifetime = 0; 
        this.age = 0;
        this.active = false;
    }
    reset() {
        if ( true === this.active ) return;

        this.lifetime = mt_rand(30, 60) * 60;
        this.radius = mt_rand(25, 150);
        this.y = this.radius * 2 + mt_rand(0, this.cfg.canvasH - this.radius * 2);

        this.maxStrength = mt_randf(0.005, 0.009); // maxStrength - +ve = clockwise, -ve = anticlockwise
        if ( Math.random() < 0.5 )
            this.maxStrength = -this.maxStrength;

        this.driftSpeed = mt_randf(0.05, 0.15); // +ve drifts L -> R,  -ve is R -> L
        if ( Math.random() < 0.5 )
            this.driftSpeed = -this.driftSpeed;
        
        if ( this.driftSpeed > 0 )
            this.x = mt_rand(this.radius * 2, this.cfg.canvasW / 2);
        else 
            this.x = mt_rand(this.cfg.canvasW - this.radius * 2, this.cfg.canvasW / 2);
        
        if ( this.radius < 50 ) {
            this.y = mt_rand(this.cfg.canvasH - this.radius * 4, this.cfg.canvasH - this.radius * 2);
            this.maxStrength = 0.09;
            this.lifetime = mt_rand(10, 30) * 60;
        }    
        
        this.strength = 0;
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
