import { phaser } from "./functions.js";

export default class Clock {
    constructor() {
        this.hands = {};
        this.elapsed = 0;
        this.speed = 1;
    }
    update(dt, elapsed) {
        this.elapsed += dt;
        this.speed = phaser(this.elapsed, 20, 20);
        for ( const [name, hand] of Object.entries(this.hands) )
            hand.update(dt, this.speed);
        
    }
    add(h) {
        this.hands[h.name] = h;
        return this;
    }
}
