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
    addAmbient(col, strength) {
        return this.setLight("ambients", new this.three.AmbientLight(col, strength));
    }
    addDirectional(col, strength, pos) {
        const light = this.setLight("directionals", new this.three.DirectionalLight(col, strength));
        light.position.set(pos.x, pos.y, pos.z);
        return light;
    }
    addLight(scene, l) {
        if ( l.sort === "ambient" ) scene.add(this.addAmbient(l.color, l.intensity));
        if ( l.sort === "directional" ) scene.add(this.addDirectional(l.color, l.intensity, l.pos));
    }
    keyNotFound(id) {
        const keys = Object.keys(this.lights);
        return keys.indexOf(id) === -1;
    }
    setPosition(id, x, y, z) {
        if ( this.keyNotFound(id) )  return;
            //console.log("before", this.lights[id].position);
            this.lights[id].position.set(x, y, z);
            //console.log("after", this.lights[id].position);
    }
    setColor(id, col) {
        if ( this.keyNotFound(id) ) return;
        this.lights[id].color.set(col);
    }
    setStrength(id, strength) {
        if ( this.keyNotFound(id) ) return;
        this.lights[id].intensity = strength;
    }
    update(lights) {
        for ( const [id, l] of Object.entries(lights) ) {         // console.log(l);
            this.setColor(l.id, l.color);
            this.setStrength(l.id, l.intensity);
            if ( l.sort === "directional" ) { 
                this.setPosition(l.id, l.pos.x, l.pos.y, l.pos.z);
            }
        }
    }
}
