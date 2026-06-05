import { mt_rand, mt_randf } from "./functions.js";
import WeatherCell from "./weather-cell.js";

export default class Downdraft extends WeatherCell {

    constructor(cfg) {
        super(cfg);
        this.width = 0;
        this.height = 0;
    }
    reset() {
        if ( true === this.active ) return;
        this.maxStrength = mt_randf(0.005, 0.01);
        this.x = mt_rand(6, 120);
        this.y = mt_rand(20, 100);
        this.width = mt_rand(100, 700);
        this.height = mt_rand(360, 400);
        this.lifetime = mt_rand(6, 10) * 60;
        this.driftSpeed = mt_randf(1.5, 2.5);
        this.baseReset();
    }
    update() {
        super.update();
        this.x -= this.driftSpeed;
        this.y += this.driftSpeed;
    }
    sample(px, py) {

        if (false === this.active) return this.noForce;

        const dx = px - this.x;
        const dy = py - this.y;

        const halfHeight = this.height * 0.5;
        const distX = Math.abs(dx);
        const distY = Math.abs(dy);

        // outside sheet
        if ( distX < this.x || distX > this.x + this.width ) return this.noForce;
        if ( distY > halfHeight ) return this.noForce;

        const force = this.getForce(distY, halfHeight);

        let vy = 0;

        if (dy > 0) 
            vy = force * Math.random();

        return { x: 0,  y: vy };
    }
}