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
        if ( l.sort === "ambient" ) scene.add(this.ambient(l.color, l.intensity));
        if ( l.sort === "directional" ) scene.add(this.directional(l.color, l.intensity, l.pos));
    }
    setPosition(id, x, y, z) {
        this.lights[id].position.set(x, y, z);
    }
    setColor(id, col) {
        const keys = Object.keys(this.lights);
        console.log(keys, id, keys.indexOf(id));
        this.lights[id].color.set(col);
    }
    setStrength(id, strength) {
        const keys = Object.keys(this.lights);
        console.log(keys, id, keys.indexOf(id));
        this.lights[id].intensity = strength;
    }
    update(lights) {
        console.log(this.lights, lights);
        for ( const [id, l] of Object.entries(lights) ) { 
            const fid = id.slice(0, -1) + "s" + id.slice(-1);
            console.log(l);
            
            this.setColor(fid, l.color);
            this.setStrength(fid, l.intensity);
            if ( l.type === "directional" ) {
                this.setPosition(fid, l.pos.x, l.pos.y, l.pos.z);
            }
        }
    }
}
