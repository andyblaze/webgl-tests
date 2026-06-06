import { mt_rand, mt_randf } from "./functions.js";
import WeatherCell from "./weather-cell.js";

export default class Downdraft extends WeatherCell {

    constructor(cfg) {
        super(cfg);
        this.width = 0;
        this.height = 0;
        this.totalSections = 20;
        this.sectionWidth = this.cfg.canvasW / this.totalSections;
        this.minSections = 5;
        this.maxSections = 8;

    }
    getPlacement() {
        const downdraftSections = mt_rand(this.minSections, this.maxSections);
        const maxStartSection = this.totalSections - downdraftSections;
        const startSection = mt_rand(0, maxStartSection);
        //const left = startSection * this.sectionWidth;
        //const w = downdraftSections * this.sectionWidth;
        return { 
            x: startSection * this.sectionWidth, 
            width: downdraftSections * this.sectionWidth 
        };
    }
    reset() {
        if ( true === this.active ) return;
        this.maxStrength = mt_randf(0.025, 0.045);
        const placement = this.getPlacement();
        this.x = placement.left;
        this.y = mt_rand(0, 10);
        this.width = placement.width;
        this.height = mt_rand(260, 300);
        this.lifetime = mt_rand(1, 4) * 60;
        this.driftSpeed = mt_randf(0.25, 1);
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