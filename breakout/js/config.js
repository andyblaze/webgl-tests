export default class Config {
    constructor() {
        this.wallCfg = { cols:16, rows: 10, brickW: 1, brickH: 0.5 };
        this.paddleCfg = { x: 0, y: -6, width: 3, height: 0.3, speed:8, maxAngleFactor: 6 };
        this.ballCfg = { x: 0, y: -2, radius: 0.2, vx: 5, vy: 3 };
        this.edgesCfg = { left: -10, right: 10, top: 7.5, bottom: -7.5 };
    }
}
