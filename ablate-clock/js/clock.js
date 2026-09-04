import { mt_rand, randomSpeed } from "./functions.js";

export default class Clock {
    constructor(phaser) {
        this.hands = {};
        this.elapsed = 0;
        this.speedMultiplier = 1;
        this.phaser = phaser;
    }
    update(dt, elapsed) {
        this.elapsed += dt;
        if ( mt_rand(0, 300) < 1 )
            this.phaser.start(randomSpeed(), mt_rand(8, 16));

        this.speedMultiplier = this.phaser.update(dt);

        for ( const [name, hand] of Object.entries(this.hands) )
            hand.update(dt, this.speedMultiplier);
        
    }
    add(h) {
        this.hands[h.name] = h;
        return this;
    }
}
