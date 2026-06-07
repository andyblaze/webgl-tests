import { mt_rand, mt_randf, createOptions } from "./functions.js";

export default class HailParticle {

    constructor(cfg, opts) {

        this.x = opts.x;
        this.y = opts.y;

        this.vx = opts.vx;
        this.vy = opts.vy;

        this.radius = opts.radius;
        this.bottom = this.y + (this.radius / 2);

        // larger particles feel heavier
        this.mass = Math.sqrt(this.radius) * mt_randf(cfg.minMassAdjuster, cfg.maxMassAdjuster);

        // status & removal
        this.sleeping = false;
        this.sleepAge = 0;
        this.alpha = 1;
        this.dead = false;
        this.color = this.createColor(cfg.particleHue);
    }
    createColor(particleHue) {
        const baseHue = particleHue;
        // slight icy variation around the base hue
        const hue = baseHue + mt_rand(-5, 5);
        // keep snow low-saturation (almost white)
        const sat = mt_rand(15, 25);
        // keep it bright, near-white
        const light = mt_rand(85, 95);
        return `hsla(${hue}, ${sat}%, ${light}%, ${this.alpha})`;        
    }
    update(cfg, particlesSys, storm) {

        if (this.sleeping) {
            if ( this.dead ) return; 
            this.sleepAge++;
            this.alpha *= cfg.alphaFadeRate;
            this.radius *= cfg.radiusShrinkRate;
            if ( this.dead === false && (this.radius <= 0.5 || this.alpha <= 0.1))
                this.dead = true;
            return;
        }
        // gravity
        this.vy += cfg.gravity * this.mass;

        // air resistance
        this.vx *= (1 - cfg.airDrag);
        this.vy *= (1 - cfg.airDrag); 

        // wind, smaller particles are affected more
        const wind = storm.sampleWind(this.x, this.y);

        this.vx += wind.x / this.mass;
        this.vy += wind.y / this.mass;

        // movement
        this.x += this.vx;
        this.y += this.vy;
        this.bottom = this.y + (this.radius / 2);

        // floor collision
        const t = this.radius / cfg.maxRadius;

        const floorY =
            cfg.canvasH -
            this.radius -
            ((1 - t) * 20);

        if ( this.y >= floorY ) {
            this.y = floorY;
            // bounce
            this.vy *= -cfg.bounceLoss;
            // friction
            this.vx *= cfg.groundFriction;
            // fragmentation
            if (
                Math.abs(this.vy) > cfg.breakVelocity &&
                this.radius > cfg.minBreakRadius
            ) {
                this.shatter(cfg, particlesSys);
            }
            // sleep check
            if (Math.abs(this.vy) < cfg.sleepThreshold) {
                this.vy = 0;
                this.vx = 0;
                this.sleeping = true;
            }
        }
    }
    shatter(cfg, particleSys) {
        const count = mt_rand(cfg.fragmentCountMin, cfg.fragmentCountMax);

        for ( let i = 0; i < count; i++ ) {
            const angle = Math.random() * Math.PI * 2;
            const speed = mt_randf(1, 4);

            const options = createOptions(
                this.x,
                this.y,
                this.radius * mt_randf(0.35, 0.6),
                Math.cos(angle) * speed,
                Math.sin(angle) * speed * 0.5
            );
            particleSys.spawn(new HailParticle(options));
        }
        // remove original
        this.radius = 0;
        this.sleeping = true;
    }
    outOfView(cfg) {
        if (( this.x < -100 || this.x > cfg.canvasW + 100 ) || ( this.y < -20 || this.y > cfg.canvasH )) {
            this.dead = true;
            return true;
        }
        return false;
    }
    draw(cfg) {
        if ( this.outOfView(cfg) ) return;

        cfg.ctx.fillStyle = this.color;
        cfg.ctx.beginPath();
        cfg.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        cfg.ctx.fill();
    }
}
