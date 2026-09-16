import Box from "./box.js";
import Torus from "./torus.js";

export class ShapeRegistry {
    constructor(three) {
        this.three = three;
        this.data = {
            cube: {
                ctor: Box,
                geoDefault : {
                    width: 1, height: 1, depth: 1, 
                    widthSegments: 1, heightSegments: 1, depthSegments: 1
                },
                matDefault: { color: 0xffffff }
            },
            torus: {
                ctor: Torus
            }
        };
    }
    get(type) {
        return this.data[type];
    }
}

export class ShapeFactory  {
    constructor(reg) {
        this.registry = reg;
    }
    create(type, cfg, geoCfg={}, matCfg={}) {
        const def = this.registry.get(type);
        return new def.ctor(this.registry.three, 1, 0.25, cfg);
    }
}
