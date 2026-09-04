import { phaser, mt_rand } from "./functions.js";

class Phaser {
    constructor() {
        this.stop(1);
    }
    start(sm, d) {
        if ( true === this.running ) return;
        //console.log(sm, d);
        this.speedMultiplier = sm;
        this.duration = d;
        this.running = true;
    }
    stop(phase) { //console.log(phase);
        if ( phase < 1.001 ) {
            //console.log("stop");
            this.elapsed = 0;
            this.running = false;
            this.speedMultiplier = 1;
            this.duration = 0;
        }
        return 1;
    }
    update(dt, elapsed) {
        this.elapsed += dt;
        if ( this.running ) {
            const p = this.phase(elapsed, this.speedMultiplier, this.duration);
            if ( this.elapsed >= this.duration ) return this.stop(p);
            return p;
        }
        else
            return 1;
    }
    phase(elapsed, maxSpeed, duration) {
        const phase = elapsed * 2 * Math.PI / duration;
        return 1 + (maxSpeed - 1) * (1 - Math.cos(phase)) / 2;
    }
}

export default class Clock {
    constructor() {
        this.hands = {};
        this.elapsed = 0;
        this.speedMultiplier = 1;
        this.phaser = new Phaser();
    }
    update(dt, elapsed) {
        this.elapsed += dt;
        if ( mt_rand(0, 100) < 1 )
            this.phaser.start(mt_rand(-20, 20), mt_rand(5, 10));
        this.speedMultiplier = this.phaser.update(dt, this.elapsed);//phaser(this.elapsed, -20, 30);
        for ( const [name, hand] of Object.entries(this.hands) )
            hand.update(dt, this.speedMultiplier);
        
    }
    add(h) {
        this.hands[h.name] = h;
        return this;
    }
}
