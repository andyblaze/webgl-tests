import { mt_rand } from "./functions.js";

export default class GravityWell {
    constructor(x, y, z, st, sp, os, or) {
        this.x = mt_rand(5, 20);
        this.y = mt_rand(5, 20);
        this.z = 0;
        this.strength = Math.random() < 0.5 ? mt_rand(10, 13) : -mt_rand(10, 13);
        this.spread = mt_rand(30, 50);
        this.orbitSpeed = mt_rand(7000, 12000);
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
        //this.strength = this.strength * Math.sin(t * this.orbitSpeed + this.orbitRadius);
        const angle = (t / this.orbitSpeed) + this.phase;
        this.x = Math.cos(angle) * this.orbitRadius;
        this.y = Math.sin(angle) * this.orbitRadius;
    }
}
