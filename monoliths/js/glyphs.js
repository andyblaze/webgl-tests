import { hexToHSLA, HSLAString, mt_rand, createElmnt } from "./functions.js";

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
        const { ctx, canvas } = this;
        const hue = mt_rand(20, 180);
        const c = { h: hue, s: 100, l:50, a: 1 };
        const hsla = HSLAString(c);
        
        this.clearPlane(ctx, canvas);

        this.setFontColor(ctx, hsla);
        this.writeText(ctx, canvas, this.text);
        this.textTexture.needsUpdate = true;
    }
}
