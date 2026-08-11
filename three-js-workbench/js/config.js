import { byId } from "./functions.js";

export default class Config {
    constructor(htmlElementId) {
        this.workspace = byId(htmlElementId);
        this.clientW = this.workspace.clientWidth;
        this.clientH = this.workspace.clientHeight;
        this.aspectRatio = this.clientW / this.clientH;
        this.geometry = "cylinder";
        this.materialType = "physical";
        this.material = {};
        this.lights = {};
        this.maps = {}
        this.observers = {};
    }
    fixValue(c) {
        const type = c.dataset.type;
        if ( type === "map" ) return c.dataset.mapsrc;
        if ( type === "color" )   return c.value;
        if ( type === "float" ) return parseFloat(c.value);
        if ( type === "vec2" ) return [parseFloat(c.value), parseFloat(c.value)];
        if ( type === "int" )   return parseInt(c.value);
        if ( type === "bool" )  return c.value === "1";
    }
    addObserver(type, o) {
        this.observers[type] = o; //console.log("obs", this.observers);
    }
    notify(type) {
        //for ( const [type, o] of Object.entries(this.observers) )
        const o = this.observers[type];
        o.update(this[type]);
    }
    updatePos(item, ctrl) {
        const axis = ctrl.dataset.axis;
        item["pos"][axis] = this.fixValue(ctrl); 
    }
    initLight(id, lightType, type) {
        return { 
            "id": id, "sort": lightType, "type": type,
            "color": "", "intensity": 0, 
            "pos": { "x": 0, "y": 0, "z": 0 } 
        };
    }
    updateLights(type, ctrls) {
        const item = this[type];
        for ( const c of ctrls ) {
            const id = c.dataset.lightid;
            const key = c.dataset.property;
            if ( typeof item[id] !== "object" ) 
                item[id] = this.initLight(id, c.dataset.lighttype, c.dataset.type);

            if ( key === "pos" ) 
                this.updatePos(item[id], c);  
            else 
                item[id][key] = this.fixValue(c);
        }
    }
    updateMaterial(type, ctrls) {
        const item = this[type];
        for ( const c of ctrls )
            item[c.dataset.property] = { "type": c.dataset.type, "value": this.fixValue(c) };
    }
    updateMaps(type, ctrls) { //console.log("t", type)
        const item = this[type];
        for ( const c of ctrls )
            item[c.dataset.property] = { "type": c.dataset.type, "value": this.fixValue(c) };
        //console.log(item);
    }
    update(type, ctrls) {
        if ( type === "lights" )
            this.updateLights(type, ctrls);
        if ( type === "material" )
            this.updateMaterial(type, ctrls);
        if ( type === "maps" )
            this.updateMaps(type, ctrls);
        this.notify(type);
    }
}
