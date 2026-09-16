export class LightRegistry {
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

        };
    }
    get(type) {
        return this.data[type];
    }
}

export class LightFactory  {
    constructor(reg) {
        this.registry = reg;
    }
    create(type, cfg) {
        const def = this.registry.get(type);
        return new def.ctor(...def.args(cfg));
    }
}
