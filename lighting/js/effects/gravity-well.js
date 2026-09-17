import { mt_randf, mt_rand } from "../functions.js";

export default class GravityWell {
    constructor(n) {
        this.noise = n;
        this.x = mt_rand(5, 20);
        this.y = mt_rand(5, 20);
        this.z = 0;
        this.strength = Math.random() < 0.5 ? mt_randf(0.25, 0.5) : -mt_randf(0.25, 0.5);
        this.spread = mt_rand(10, 18);
        this.orbitSpeed = mt_rand(4000, 6500);
        this.orbitRadius = mt_rand(15, 20);  
        this.phase = Math.random() * Math.PI * 2;
        this.noiseOffset = Math.random() * 10000;
    }
    influence(ox, oy, oz) {
        const dx = ox - this.x;
        const dy = oy - this.y;
        const distanceSquared = (dx * dx) + (dy * dy);
        return this.strength * Math.exp(-distanceSquared / this.spread);
    }
    update(t) {
        const angle = (t / this.orbitSpeed) + this.phase;
        //const wobble = ((this.noise.sample(t / 5000) * 2) - 1) * 3;
        const wobble = (this.noise.sample(t / 5000 + this.noiseOffset) * 2 - 1) * 3;

        const xRadius = this.orbitRadius * 0.25;
        const yRadius = this.orbitRadius * 0.75;

        this.x = Math.cos(angle) * xRadius + wobble;
        this.y = Math.sin(angle) * yRadius + wobble;
    }
}
