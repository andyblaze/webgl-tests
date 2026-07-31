import { byId, byQsArray } from "./functions.js";

export default class UiControls {
    constructor() { //selector) {
        //this.ctrls = byQsArray(selector);
        this.observers = [];
        //for ( const ctrl of this.ctrls ) {
        //    ctrl.oninput = () => this.synch(ctrl);
        //}
    }
    init(selector, type, target) {
        this.ctrls = byQsArray(selector);
        this.type = type;
        this.observers = [target];
        for ( const ctrl of this.ctrls ) {
            ctrl.oninput = () => this.synch(ctrl, this.type);
        }
    }
    synch(ctrl) {
        const label = ctrl.dataset.label ?? null; 
        if ( typeof label === "string" )
            byId(label).textContent = ctrl.value;
        this.notify();
    }
    addObserver(o) {
        this.observers.push(o);
    }
    notify() {
        for ( const o of this.observers ) {
            o.update(this.type, this.ctrls);
            o.notify(this.type);
        }
    }
}
