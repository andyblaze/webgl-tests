import { mt_rand } from "./functions.js";

export default class Shutter {
    constructor(s) {
        this.shutter = s;
        this.css = this.shutter.style;
        this.transitionTimer = 0;
        this.holdTimer = 0;
        // timings in seconds
        this.openTimes = { minTime: 38, maxTime: 48 };
        this.openTime = 0;
        this.setOpenTime(this.openTimes);
        this.holdTime = 0.125;

        this.shutterState = "open";
        this.fadeSpeed = 0.25;
        this.css.opacity = 0;
        this.observer = null;
        this.notified = false;
    }
    setOpenTime(t) {
        this.openTime = mt_rand(t.minTime, t.maxTime);
    }
    setOpenTimes(meta) {
        this.openTimes = { minTime: meta.minTime, maxTime: meta.maxTime }; 
    }
    addObserver(o) {
        this.observer = o;
        this.setOpenTimes(this.observer.scene.meta);
    }
    notify() {
        if ( true === this.notified ) return;        
        this.observer.update();      
        this.setOpenTimes(this.observer.scene.meta);
    }
    setState(s) {
        this.shutterState = s;
    }
    update(dt) {
        this.transitionTimer += dt;
        if ( this.transitionTimer > this.openTime && this.shutterState === "open" ) {
            this.css.opacity = Math.min(parseFloat(this.css.opacity) + (dt * this.fadeSpeed), 1);
            if ( this.css.opacity > 0.99999 ) {
                this.setState("holding");
                this.notify();
                this.notified = true;
            }
        }
        if ( this.shutterState === "holding" ) {
            this.css.opacity = 1;
            this.holdTimer += dt;
            if ( this.holdTimer > this.holdTime ) {
                this.holdTimer = 0;
                this.setState("closed");
                this.setOpenTime(this.openTimes);
            }
        }
        if ( this.shutterState === "closed") {
            this.css.opacity = Math.max(parseFloat(this.css.opacity) - (dt * this.fadeSpeed), 0);
            if ( this.css.opacity < 0.00001 ) {
                this.transitionTimer = 0;
                this.setState("open");
                this.notified = false;
            }
        }       
    }
}
