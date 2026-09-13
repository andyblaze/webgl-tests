import ThreeObj from "./three-obj.js";

export default class Light extends ThreeObj {
    constructor(factory, type, cfg) {
        super();
        this.threeObj = factory.create(type, cfg);
        this.baseIntensity = cfg.intensity;
        this.dimmerAmount = 0;
        this.dimmerSpeed = 0;
        this.dimmerTime = 0;
    }
    update(dt, elapsed) {
        super.update(dt, elapsed);
        this.dimming(dt, elapsed);
    }
    dimming(dt, elapsed) {
        if ( 0 === this.dimmerAmount ) return;
        this.dimmerTime += dt * this.dimmerSpeed;

        const wave = (Math.sin(this.dimmerTime * Math.PI * 2) + 1) / 2;

        const minIntensity = this.baseIntensity * this.dimmerAmount;

        this.threeObj.intensity = minIntensity + (this.baseIntensity - minIntensity) * wave;
    }
    setDimming(amount, speed) {
        this.dimmerAmount = amount;
        this.dimmerSpeed = speed;
        return this;
    }
    setShadowMapSize(sz) {
        this.threeObj.shadow.mapSize.set(sz, sz);
        return this;
    }
}
