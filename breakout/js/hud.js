import { byId } from "./functions.js";

export default class Hud {
    constructor() {
        this.lives = byId("lives");
        this.score = byId("score");
    }
    setItem(item, txt) {
        item.innerText = txt;
    }
    update(data) {
        this.setItem(this.lives, data.lives);
        this.setItem(this.score, data.score);
    }
}
