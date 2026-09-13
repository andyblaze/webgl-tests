import ThreeObj from "./three-obj.js";

export default class Light extends ThreeObj {
    constructor(factory, type, cfg) {
        super();
        this.threeObj = factory.create(type, cfg);
        this.baseIntensity = cfg.intensity;
        this.dimmerAmount = 0;
        this.dimmerSpeed = 0;
    }
    setShadowMapSize(sz) {
        this.threeObj.shadow.mapSize.set(sz, sz);
        return this;
    }
    update(dt, elapsed) {
        super.update(dt, elapsed);
    }
}
