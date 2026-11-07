import { byId } from "./functions.js";

export default class Canvas {
    constructor(id) {
        this.canvas = byId(id);
        this.ctx = this.canvas.getContext("2d");
        this.width = 0;
        this.height = 0;
    }
    setSize(w, h) {
        this.canvas.width = w;
        this.canvas.height = h;
        this.width = w;
        this.height = h;
        return this;
    }
    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        return this;
    }
    ondraw() {

    }
    draw(img) {
        this.ctx.drawImage(img, 0, 0);
        this.ondraw();
        return this;
    }
    update(data) {
        this.setSize(data.img.width, data.img.height).clear().draw(data.img);
    }
}
