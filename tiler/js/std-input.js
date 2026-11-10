import { byId } from "./functions.js";

export default class StdInput {
    constructor(id) {
        this.input = byId(id);
        this.val = this.input.value;
    }
    onchange(func) {
        this.input.addEventListener("change", func);
    }
    change() {
        this.val = this.input.value;
    }
    get value() {
        return this.val;
    }
    get name() {
        return this.input.name;
    }    
}
