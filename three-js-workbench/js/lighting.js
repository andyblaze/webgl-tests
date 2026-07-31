export default class Lighting {
    constructor(three) {
        this.three = three;
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
    ambient(col, strength) {
        return this.addLight("ambients", new this.three.AmbientLight(col, strength));
    }
    directional(col, strength, pos) {
        const light = this.addLight("directionals", new this.three.DirectionalLight(col, strength));
        light.position.set(pos.x, pos.y, pos.z);
        return light;
    }
    setPosition(id, x, y, z) {
        this.lights[id].position.set(x, y, z);
    }
    setColor(id, col) {
        this.lights[id].color.set(col);
    }
    setStrength(id, strength) {
        this.lights[id].intensity = strength;
    }
}
