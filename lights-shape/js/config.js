export default class Config {
    constructor(wnd) {
        this.innerW = wnd.innerWidth;
        this.innerH = wnd.innerHeight;
        this.halfW = this.innerW / 2;
        this.halfH = this.innerH / 2;
        this.aspect = wnd.innerWidth / wnd.innerHeight;
        this.dpr = wnd.devicePixelRatio;
        this.dprW = this.innerW * this.dpr;
        this.dprH = this.innerH * this.dpr;
    }
}
