export default class Lighting {
    constructor(three) {
        this.three = three;
        this.ambients = [];
        this.directionals = [];
        this.points = [];
        this.lights = {};
    }
    setLight(type, light) {
        const id = this[type].length;
        this[type][id] = light;
        this.lights[type + id] = this[type][id];
        return this[type][id];
    }
    ambient(col, strength) {
        return this.setLight("ambients", new this.three.AmbientLight(col, strength));
    }
    directional(col, strength, pos) {
        const light = this.setLight("directionals", new this.three.DirectionalLight(col, strength));
        light.position.set(pos.x, pos.y, pos.z);
        return light;
    }
    addLight(scene, l) {
        if ( l.type === "ambient" ) scene.add(this.ambient(l.color, l.intensity));
        if ( l.type === "directional" ) scene.add(this.directional(l.color, l.intensity, l.pos));
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
