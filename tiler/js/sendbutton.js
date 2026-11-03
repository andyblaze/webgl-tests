import { byId } from "./functions.js";

export default class SendButton {
    constructor(id) {
        this.input = byId(id);
    }
    update(data) {
        this.input.disabled = data.state;
    }
}
