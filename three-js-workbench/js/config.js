import { byId } from "./functions.js";

export default class Config {
    constructor(htmlElementId) {
        this.workspace = byId(htmlElementId);
        this.clientW = this.workspace.clientWidth;
        this.clientH = this.workspace.clientHeight;
        this.aspectRatio = this.clientW / this.clientH;
        this.material = {};
        this.lights = {};
        this.observers = {};
    }
    fixValue(c) {
        const type = c.dataset.type;
        if ( type === "str" )   return c.value;
        if ( type === "float" ) return parseFloat(c.value);
        if ( type === "int" )   return parseInt(c.value);
        if ( type === "bool" )  return c.value === "1";
    }
    addObserver(type, o) {
        this.observers[type] = o;
    }
    notify(type) {
        //for ( const [type, o] of Object.entries(this.observers) )
        const o = this.observers[type];
        o.update(this[type]);
    }
    updateLights(type, ctrls) {
        const item = this[type];
        for ( const c of ctrls ) {
            const id = c.dataset.lightid;
            const key = c.dataset.property;
            const lightType = c.dataset.lighttype;
            //console.log(key, val);
            if ( typeof item[id] !== "object" ) {
                item[id] = { "type": lightType, "color": "", "intensity": 0, "pos": { "x": 0, "y": 0, "z": 0 } };
            }
            if ( key === "pos" ) {
                const axis = c.dataset.axis;
                item[id]["pos"][axis] = this.fixValue(c);  
            }
            else {
                item[id][key] = this.fixValue(c);
            }
        }
        this.notify(type);
        //console.log(this[type]);
    }
    update(type, ctrls) {
        if ( type === "lights" )
            return this.updateLights(type, ctrls);
        const item = this[type];
        for ( const c of ctrls )
            item[c.dataset.property] = this.fixValue(c);
    }
}
