export default class Shutter {
    constructor(s) {
        this.shutter = s;
        this.css = this.shutter.style;
        this.transitionTimer = 0;
        this.openTime = 10;
        this.holdTime = 2;
        this.holdTimer = 0;
        this.shutterState = "open";
        this.fadeSpeed = 0.125;
        this.css.opacity = 0;
    }
    setState(s) {
        this.shutterState = s;
    }
    update(dt) {
        this.transitionTimer += dt;
        if ( this.transitionTimer > this.openTime && this.shutterState === "open" ) {
            this.css.opacity = Math.min(parseFloat(this.css.opacity) + (dt * this.fadeSpeed), 1);
            if ( this.css.opacity > 0.99999 )
                this.setState("holding");
        }
        if ( this.shutterState === "holding" ) {
            this.css.opacity = 1;
            this.holdTimer += dt;
            if ( this.holdTimer > this.holdTime ) {
                this.holdTimer = 0;
                this.setState("closed");
            }
        }
        if ( this.shutterState === "closed") {
            this.css.opacity = Math.max(parseFloat(this.css.opacity) - (dt * this.fadeSpeed), 0);
            if ( this.css.opacity < 0.00001 ) {
                this.transitionTimer = 0;
                this.setState("open");
            }
        }       
    }
}
