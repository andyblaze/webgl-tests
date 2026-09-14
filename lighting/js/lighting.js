import { LightFactory, LightRegistry } from "./light-factory.js";
import Light from "./light.js";

export default class Lighting {
    constructor(three) {
        this.factory = new LightFactory(new LightRegistry(three));
        this.lights = [];
        this.index = -1;
    }
    add(scene, type, cfg) {
        this.lights.push(new Light(this.factory, type, cfg));
        this.index++;
        scene.add(this.lights[this.index].native);
        return this.lights[this.index];
    }
    update(dt, elapsed) {
        for ( const l of this.lights )
            l.update(dt, elapsed);
    }
}
