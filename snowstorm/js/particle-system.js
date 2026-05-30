import HailParticle from "./hail-particle.js";
import { mt_randf, createOptions } from "./functions.js";

export default class ParticleSystem {
    constructor(cfg) {
        this.cfg = cfg;
        this.particles = [];
    }
    spawn(opts=false, idx=false) {
        if ( this.particles.length >= this.cfg.maxParticles ) return;
        let options  = {};
        if ( opts === false ) {
            const t = Math.pow(Math.random(), 2);

//radius = 0.5 + t * (maxRadius - 0.5);
            options = createOptions(
                mt_randf(0, this.cfg.canvasW),
                0,
                0.5 + t * (this.cfg.maxRadius - 0.5), //mt_randf(this.cfg.minRadius, this.cfg.maxRadius),
                mt_randf(-0.5, 0.5),
                mt_randf(this.cfg.minFallSpeed, this.cfg.maxFallSpeed)
            );
        }
        else 
            options = opts;

        if ( idx === false )
            this.particles.push(new HailParticle(this.cfg, options));
        else 
            this.particles[idx] = new HailParticle(this.cfg, options);
    }
    update(storm) {
        for (let i = this.particles.length - 1; i >= 0; i--) {

            const p = this.particles[i];

            p.update(this.cfg, this, storm);
            p.draw(this.cfg);

            // cleanup dead particles
            if ( p.dead ) {
                //this.spawn(false, i);
                this.particles.splice(i, 1);
            }
        }
    }
}