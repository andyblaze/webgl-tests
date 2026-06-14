import { mt_rand } from "./functions.js";

export default class GravityWell {
    constructor(x, y, z, st, sp, os, or) {
        //this.random = true;
        //if ( true === this.random ) {
        this.x = mt_rand(10, 60);
        this.y = mt_rand(10, 60);
        this.z = z;
        this.strength = Math.random() < 0.5 ? mt_rand(1, 3) : -mt_rand(1, 3);
        this.spread = mt_rand(40, 60);
        this.orbitSpeed = mt_rand(7000, 12000);
        this.orbitRadius = mt_rand(10, 90);  
        this.phase = Math.random() * Math.PI * 2;
        /*}
        else {
            this.x = x;
            this.y = y;
            this.z = z;
            this.strength = Math.random() < 0.5 ? st : -st;
            this.spread = sp;
            this.orbitSpeed = os;
            this.orbitRadius = or;
        }*/
        //this.update(performance.now());
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
