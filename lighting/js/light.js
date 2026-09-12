import ThreeObj from "./three-obj.js";

class Registry {
    constructor(three) {
        this.data = {
            ambient: {
                ctor: three.AmbientLight,
                args: cfg => [cfg.color, cfg.intensity]
            },
            point: {
                ctor: three.PointLight,
                args: cfg => [
                    cfg.color,
                    cfg.intensity,
                    cfg.distance,
                    cfg.decay
                ]
            }
        }
    }
    getType(t) {
        return this.data[t];
    }
}

class Factory  {
    static create(definition, cfg) {
        return new definition.ctor(...definition.args(cfg));
    }
}

export default class Light extends ThreeObj {
    constructor(three, type, cfg) {
        super();
        const registry = new Registry(three);
        const ctor = registry.getType(type);

        if (!ctor) {
            throw new Error(`Unknown light type: ${type}`);
        }

        this.threeObj = Factory.create(ctor, cfg);
    }
}
