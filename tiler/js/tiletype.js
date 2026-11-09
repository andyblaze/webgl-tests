import { byId } from "./functions.js";

export default class TileType {
    constructor(id) {
        this.select = byId(id);
        this.val = this.select.value;
    }
    onchange(func) {
        this.select.addEventListener("change", func);
    }
    change() {
        this.val = this.select.value;
    }
    get value() {
        return this.val;
    }
    get name() {
        return this.select.name;
    }
}
