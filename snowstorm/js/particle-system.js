import HailParticle from "./hail-particle.js";
import { mt_randf, createOptions } from "./functions.js";

export default class ParticleSystem {
    constructor(cfg) {
        this.cfg = cfg;
        this.particles = [];
    }
    spawn(opts=false) {
        if ( this.particles.length >= this.cfg.maxParticles ) return;
        let options  = {};
        if ( opts === false ) {
            options = createOptions(
                mt_randf(0, this.cfg.canvasW),
                0,
                mt_randf(this.cfg.minRadius, this.cfg.maxRadius),
                mt_randf(-0.5, 0.5),
                mt_randf(this.cfg.minFallSpeed,this.cfg.maxFallSpeed)
            );
        }
        else 
            options = opts;

        this.particles.push(new HailParticle(options));
    }
    update() {
        for (let i = this.particles.length - 1; i >= 0; i--) {

            const p = this.particles[i];

            p.update(this.cfg, this);
            p.draw(this.cfg);

            // cleanup dead particles
            if ( p.dead ) {
                this.particles.splice(i, 1);
            }
        }
    }
}