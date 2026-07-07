import DeltaReport from "./delta-report.js";

export default class Controller {
    constructor(m, v, c) {
        this.model = m;
        this.view = v;
        this.cfg = c;
        this.paused = false;
        this.frameCount = 0;
    }
    resize() {
        this.paused = true;
        this.view.resize(window.innerWidth, window.innerHeight);
        this.paused = false;
    }
    // fps throttling
    frameReady() {
        this.frameCount = (this.frameCount + 1) % this.cfg.framesPerTick;
        return this.frameCount % this.cfg.framesPerTick === 0;
    }
    loop(timestamp) {
        if ( this.paused === false ) {            
            if ( this.frameReady() ) {
                const data = this.model.tick();
                this.view.draw(data);
                DeltaReport.log(timestamp);
            }
        }
        requestAnimationFrame(this.loop.bind(this)); 
    } 
}