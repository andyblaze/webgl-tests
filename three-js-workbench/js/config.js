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
    fixType(c) {
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
        for ( const [type, o] of Object.entries(this.observers) )
            o.update(this[type]);
    }
    update(type, ctrls) {
        const item = this[type];
        for ( const c of ctrls )
            item[c.dataset.property] = this.fixType(c);
    }
}
