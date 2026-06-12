export default class GravityWell {
    constructor(x, y, z, st, sp, os, or) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.strength = -st;
        this.spread = sp;
        this.orbitSpeed = os;
        this.orbitRadius = or;
    }
    influence(ox, oy, oz) {
        const dx = ox - this.x;
        const dy = oy - this.y;
        const distanceSquared = (dx * dx) + (dy * dy);
        return this.strength * Math.exp(-distanceSquared / this.spread);
    }
    update(t) {
        this.x = Math.cos(t / this.orbitSpeed) * this.orbitRadius;
        this.y = Math.sin(t / this.orbitSpeed) * this.orbitRadius;
    }
}
