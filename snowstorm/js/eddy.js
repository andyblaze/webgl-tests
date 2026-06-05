import { mt_rand, mt_randf } from "./functions.js";
import WeatherCell from "./weather-cell.js";

export default class Eddy extends WeatherCell {

    constructor(cfg) { 
        super(cfg);
        this.radius = 0;
    }
    reset() {
        if (true === this.active)
            return;

        // spawn position first
        this.y = mt_rand(50, this.cfg.canvasH - 50);

        // 0 = top, 1 = bottom
        const heightFactor = this.y / this.cfg.canvasH;

        // higher eddies are larger
        this.radius = Math.round(
            150 - (125 * heightFactor)
        );
        // 150 @ top
        // 25  @ bottom

        // stronger near ground
        this.maxStrength = (0.005 + (0.085 * heightFactor)) * mt_randf(0.2, 0.5);
        // 0.005 @ top
        // 0.090 @ bottom

        if (Math.random() < 0.5)
            this.maxStrength = -this.maxStrength;

        // faster drift near ground
        this.driftSpeed =
            0.05 + (0.15 * heightFactor);
        // 0.05 @ top
        // 0.20 @ bottom

        if (Math.random() < 0.5)
            this.driftSpeed = -this.driftSpeed;

        // shorter lifetime near ground
        const lifetimeSeconds =
            60 - (54 * heightFactor);
        // 60s @ top
        // 6s  @ bottom

        this.lifetime = Math.round(lifetimeSeconds * 60);

        // start somewhere sensible depending on drift

        if (this.driftSpeed > 0)
            this.x = mt_rand(this.radius * 2,
                            this.cfg.canvasW / 2);
        else
            this.x = mt_rand(this.cfg.canvasW - this.radius * 2,
                            this.cfg.canvasW / 2);

        this.baseReset();
    }
    // returns wind vector at a position
    sample(px, py) {
        if ( false === this.active ) return this.noForce;
        const dx = px - this.x;
        const dy = py - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // outside influence
        if (dist > this.radius) return this.noForce;

        const force = this.getForce(dist, this.radius);

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

        return { x: vx, y: vy };
    }
}
