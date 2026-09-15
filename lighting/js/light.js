import ThreeObj from "./three-obj.js";

export default class Light extends ThreeObj {
    constructor(factory, type, cfg) {
        super();
        this.threeObj = factory.create(type, cfg);
        this.baseIntensity = cfg.intensity;
    }
    setShadowMapSize(sz) {
        this.threeObj.shadow.mapSize.set(sz, sz);
        return this;
    }
}
