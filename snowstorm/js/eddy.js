export default class Eddy {

    constructor(x, y, radius, strength=0.05) {

        this.x = x;
        this.y = y;
        this.radius = radius;
        this.strength = strength; // positive = clockwise, negative = anticlockwise
    }
    // returns wind vector at a position
    sample(px, py) {
        const dx = px - this.x;
        const dy = py - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // outside influence
        if (dist > this.radius) {
            return { x: 0, y: 0 };
        }
        // normalize distance
        const t = dist / this.radius;

        // falloff: strongest at center, weakest at edge
        const force = (1 - t) * this.strength;

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

        return {
            x: vx,
            y: vy
        };
    }
}
