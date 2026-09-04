export default class Phaser {
    constructor() {
        this.stop(1);
    }
    start(sm, d) {
        if ( this.isRunning ) return;
        //console.log(sm, d);
        this.speedMultiplier = sm;
        this.duration = d;
        this.running = true;
    }
    stop(phase) { //console.log(phase);
        if ( Math.abs(phase) <= 1.01 ) {
            //console.log("stop");
            this.elapsed = 0;
            this.running = false;
            this.speedMultiplier = 1;
            this.duration = 0;
        }
        return 1;
    }
    get isRunning() {
        return (true === this.running);
    }
    get isStopped() {
        return (false === this.running);
    }
    get isFinished() {
        return (this.elapsed >= this.duration);
    }
    update(dt) {
        this.elapsed += dt;
        if ( this.isRunning ) {
            const p = this.phase(this.elapsed, this.speedMultiplier, this.duration);
            if ( this.isFinished ) 
                return this.stop(p);
            return p;
        }
        return 1;
    }
    phase(elapsed, maxSpeed, duration) {
        const phase = elapsed * 2 * Math.PI / duration;
        return 1 + (maxSpeed - 1) * (1 - Math.cos(phase)) / 2;
    }
}
