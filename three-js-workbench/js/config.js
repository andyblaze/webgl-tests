import { byId } from "./functions.js";

export default class Config {
    constructor(htmlElementId) {
        this.workspace = byId(htmlElementId);
        this.clientW = this.workspace.clientWidth;
        this.clientH = this.workspace.clientHeight;
        this.aspectRatio = this.clientW / this.clientH;
        this.material = {};
        this.lights = {};
        this.observers = [];
    }
    fixType(c) {
        const type = c.dataset.type;
        if ( type === "str" )   return c.value;
        if ( type === "float" ) return parseFloat(c.value);
        if ( type === "int" )   return parseInt(c.value);
        if ( type === "bool" )  return c.value === "1";
    }
    addObserver(o) {
        this.observers.push(o);
    }
    notify() {
        for ( const o of this.observers )
            o.update(this.material);
    }
    update(key, ctrls) {
        const item = this[key];
        for ( const c of ctrls )
            item[c.dataset.property] = this.fixType(c);
    }
}
