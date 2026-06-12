export default class GravityWell {
    constructor(x, y, z, st, sp, d, c) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.strength = -st;
        this.spread = sp;
        this.divisor = d;
        this.constant = c;
    }
    influence(ox, oy, oz) {
        const dx = ox - this.x;
        const dy = oy - this.y;
        const distanceSquared = (dx * dx) + (dy * dy);
        return this.strength * Math.exp(-distanceSquared / this.spread);
    }
    update(t) {
        this.x = Math.sin(t / this.divisor) * this.constant;
    }
}
