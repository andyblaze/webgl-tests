import { byId } from "./functions.js";

export default class Status {
    constructor(id) {
        this.status = byId(id);
    }
    update(data) {
        this.status.textContent = data.msg;
    }
}
