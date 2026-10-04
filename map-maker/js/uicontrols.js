import { byId, byQsArray, hslaToHex } from "./functions.js";

export default class UiControls {
    constructor(selector) {
        this.observers = [];
        this.ctrls = byQsArray(selector);
        for ( const ctrl of this.ctrls ) {
            if ( ctrl.type === "select" )
                ctrl.onchange = () => this.synch(ctrl);
            else
                ctrl.oninput = () => this.synch(ctrl);
        }
        this.notify();
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
            o.update(this.ctrls);
        }
    }
    updateFromConfig(cfg) { 
        this.ctrls.forEach(ctrl => {
            const prop = ctrl.dataset.property ?? null;
            if ( prop !== null && cfg.controlsData[prop] !== undefined ) {
                if (typeof cfg.controlsData[prop] === "object" && "h" in cfg.controlsData[prop]) {
                    ctrl.value = hslaToHex(cfg.controlsData[prop]);
                } else {
                    ctrl.value = cfg.controlsData[prop];
                }
                const lbl = ctrl.dataset.label ?? null;
                if ( lbl )
                    byId(lbl).textContent = ctrl.value;
            }
        });
        byId("renderer-select").dispatchEvent(new Event("change", { bubbles: true }));
    }
}
