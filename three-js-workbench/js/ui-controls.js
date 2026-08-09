import { byId, byQsArray } from "./functions.js";

export default class UiControls {
    constructor() { //selector) {
        this.ctrls = [];
        this.observer = null;
    }
    connect(ctrls) {
        this.ctrls = ctrls;
        /*for ( const ctrl of this.ctrls ) {
            ctrl.oninput = () => this.synch(ctrl);
        }*/
        return this;
    }
    toObserver(o) {
        this.observer = o;
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
        this.observer.update(index, this.ctrls);
    }
}
