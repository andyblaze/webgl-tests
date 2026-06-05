import { mt_rand, mt_randf } from "./functions.js";
import WeatherCell from "./weather-cell.js";

export default class Gust extends WeatherCell {

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
        this.width = mt_rand(360, 400);
        this.height = mt_rand(100, 600);
        this.lifetime = mt_rand(6, 10) * 60;
        this.driftSpeed = mt_randf(1.5, 2.5);
        this.baseReset();
    }
    sample(px, py) {

        if (false === this.active) return this.noForce;

        const dx = px - this.x;
        const dy = py - this.y;

        const halfWidth = this.width * 0.5;
        const distX = Math.abs(dx);
        const distY = Math.abs(dy);

        // outside sheet
        if ( distY < this.y || distY > this.y + this.height ) return this.noForce;
        if ( distX > halfWidth ) return this.noForce;

        const force = this.getForce(distX, halfWidth);

        let vx = 0;

        if (dx > 0) 
            vx = force * Math.random();

        return { x: vx,  y: 0 };
    }
}