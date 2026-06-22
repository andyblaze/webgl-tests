import { byId } from "./functions.js";

export default class Hud {
    constructor() {
        this.lives = byId("lives");
        this.score = byId("score");
        this.gameOver = byId("game-over");
    }
    setItem(item, txt) {
        item.innerText = txt;
    }
    update(data) {
        this.setItem(this.lives, data.lives);
        this.setItem(this.score, data.score);
        const gameOverTxt = data.gameOver ? "Game Over" : ""; 
        this.setItem(this.gameOver, gameOverTxt);
    }
}
