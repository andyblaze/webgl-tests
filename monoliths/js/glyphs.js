import { hexToHSLA, HSLAString, mt_rand, createElmnt, lerpHSLAColor } from "./functions.js";

export default class Glyphs {
    constructor(txt) {
        this.text = txt;
        this.canvas = createElmnt("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.baseSize = 256;
        this.textTexture = null;
        this.textMaterial = null;
        this.textMesh = null;
        this.width = 0;
        this.height = 0;
        this.NEON = [
            { h: 180, s: 100, l: 50, a: 1 }, // cyan
            { h: 140, s: 100, l: 50, a: 1 }, // green
            { h: 300, s: 100, l: 50, a: 1 }, // magenta
            { h: 270, s: 100, l: 60, a: 1 }, // violet
            { h: 210, s: 100, l: 55, a: 1 }  // electric blue
        ];
        this.time = 0;
    }
    initialise(width, height) {
        this.width = width;
        this.height = height;
        const { ctx, canvas } = this;
        canvas.width = this.baseSize * this.width;
        canvas.height = this.baseSize * this.height;

        this.clearPlane(ctx, canvas);

        this.setFont(ctx);
        this.setFontColor(ctx, HSLAString(hexToHSLA("#00ff00")));
        this.writeText(ctx, canvas, this.text);
    }
    build(three) {
        this.textTexture = new three.CanvasTexture(this.canvas);

        this.textMaterial = new three.MeshBasicMaterial({
            map: this.textTexture,
            transparent: true
        });

        this.textMesh = new three.Mesh(
           new three.PlaneGeometry(this.width, this.height),
           this.textMaterial
        );
        return this.textMesh;
    }
    setFontColor(ctx, color) {
        ctx.shadowColor = color;
        ctx.shadowBlur = 5;
        ctx.fillStyle = color;
    }
    setFont(ctx) {
        ctx.font = "320px Kryptonian";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
    }
    clearPlane(ctx, canvas) {
        ctx.fillStyle = "hsla(0, 10%, 10%, 1)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);        
    }
    writeText(ctx, canvas, txt) {
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText(txt, 0, 0);
        ctx.restore();        
    }
    update(dt) { // very much staging code, just to prove animation works from a RAF animate call
        this.time += dt;

        const { ctx, canvas } = this;

        const speed = 0.4;                  // colours per second
        const t = this.time * speed;

        const i1 = Math.floor(t) % this.NEON.length;
        const i2 = (i1 + 1) % this.NEON.length;
        const color = lerpHSLAColor(this.NEON[i1], this.NEON[i2], t % 1);
        
        this.clearPlane(ctx, canvas);

        this.setFontColor(ctx, HSLAString(color));
        this.writeText(ctx, canvas, this.text);
        this.textTexture.needsUpdate = true;
    }
}
