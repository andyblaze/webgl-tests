import { mt_rand } from "./functions.js";
import Noise from "./noise.js";

export default class GravityWell {
    constructor(x, y, z, st, sp, os, or) {
        this.noise = new Noise()
        this.x = mt_rand(5, 20);
        this.y = mt_rand(5, 20);
        this.z = 0;
        this.strength = Math.random() < 0.5 ? mt_rand(15, 18) : -mt_rand(15, 18);
        this.spread = mt_rand(30, 60);
        this.orbitSpeed = mt_rand(6000, 9000);
        this.orbitRadius = mt_rand(25, 60);  
        this.phase = Math.random() * Math.PI * 2;
    }
    influence(ox, oy, oz) {
        const dx = ox - this.x;
        const dy = oy - this.y;
        const distanceSquared = (dx * dx) + (dy * dy);
        return this.strength * Math.exp(-distanceSquared / this.spread);
    }
    update(t) {
        const angle = (t / this.orbitSpeed) + this.phase;
        const wobble = ((this.noise.sample(t / 5000) * 2) - 1) * 3;

        const xRadius = this.orbitRadius * 2.10;
        const yRadius = this.orbitRadius * 1.0;

        this.x = Math.cos(angle) * xRadius + wobble;
        this.y = Math.sin(angle) * yRadius + wobble;
    }    
    updateo(t) {
        const angle = (t / this.orbitSpeed) + this.phase;
        this.x = Math.cos(angle) * this.orbitRadius;
        this.y = Math.sin(angle) * this.orbitRadius;
    }
}
