export default class Config {
    constructor(three, wnd) {
        this.innerW = wnd.innerWidth;
        this.innerH = wnd.innerHeight;
        this.aspect = wnd.innerWidth / wnd.innerHeight;
        this.dpr = wnd.devicePixelRatio;
    }
}
