import { byId } from "./functions.js";

export default class Canvas {
    constructor(id) {
        this.canvas = byId(id);
        this.ctx = this.canvas.getContext("2d");
    }
    createImage(size) {
        return this.ctx.createImageData(size, size);
    }
    update(image) {
        this.ctx.putImageData(image, 0, 0);        
    }
}
