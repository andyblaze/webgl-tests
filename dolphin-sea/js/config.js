export default class Config {
    constructor(three, wnd) {
        this.innerW = wnd.innerWidth;
        this.innerH = wnd.innerHeight;
        this.halfW = this.innerW / 2;
        this.halfH = this.innerH / 2;
        this.aspect = wnd.innerWidth / wnd.innerHeight;
        this.dpr = wnd.devicePixelRatio;
    }
}
