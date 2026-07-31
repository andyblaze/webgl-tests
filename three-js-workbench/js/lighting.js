export default class Lighting {
    constructor() {
        this.ambients = [];
        this.directionals = [];
        this.points = [];
        this.lights = {};
    }
    addLight(type, light) {
        const id = this[type].length;
        this[type][id] = light;
        this.lights[type + id] = this[type][id];
        return this[type][id];
    }
    ambient(three, col, strength) {
        return this.addLight("ambients", new three.AmbientLight(col, strength));
    }
    directional(three, col, strength) {
        return this.addLight("directionals", new three.DirectionalLight(col, strength));
    }
    setPosition(id, x, y, z) { console.log(this.lights);
        this.lights[id].position.set(x, y, z);
    }
    setColor(id, col) {
        this.lights[id].color.set(col);
    }
    setStrength(id, strength) {
        this.lights[id].intensity = strength;
    }
}
