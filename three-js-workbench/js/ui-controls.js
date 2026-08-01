import { byId, byQsArray } from "./functions.js";

export default class UiControls {
    constructor() { //selector) {
        //this.ctrls = byQsArray(selector);
        this.observer = null;
        this.types = [];
        this.targets = [];
        this.lookup = {};
        //for ( const ctrl of this.ctrls ) {
        //    ctrl.oninput = () => this.synch(ctrl);
        //}
    }
    add(selector) {
        this.ctrls = byQsArray(selector);
        //this.types.push(type);
        //this.targets.push(target);
        //this.lookup[type] = target;
        for ( const ctrl of this.ctrls ) {
            ctrl.oninput = () => this.synch(ctrl);
        }
    }
    synch(ctrl) {
        const label = ctrl.dataset.label ?? null; 
        if ( typeof label === "string" )
            byId(label).textContent = ctrl.value;
        const index = ctrl.dataset.index;
        this.notify(index);
    }
    addObserver(o) {
        this.observer = o;
    }
    notify(index) {
        //for ( const o of this.observers ) {
            this.observer.update(index, this.ctrls);
            this.observer.notify(index);
        //}
    }
}
