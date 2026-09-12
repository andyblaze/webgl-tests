import ThreeObj from "./three-obj.js";

class Registry {
    static data = {};
    static init(three) {
        if ( Registry.data ) return;
        Registry.data = {
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

        };
    }
    static get(t) {
        return Registry.data[t];
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
        Registry.init(three);
        const ctor = Registry.get(type);

        if (!ctor) {
            throw new Error(`Unknown light type: ${type}`);
        }

        this.threeObj = Factory.create(ctor, cfg);
    }
}
