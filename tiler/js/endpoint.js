import { byId } from "./functions.js";

export default class EndPoint {
    constructor(id) {
        this.input = byId(id);
        this.url = this.input.value.trim();
    }
}
