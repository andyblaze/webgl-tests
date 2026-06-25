import { hexToHSLA, HSLAString, mt_rand, createElmnt } from "./functions.js";

export default class Glyphs {
    constructor(txt) {
        this.text = txt;
        this.canvas = createElmnt("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.baseSize = 256;
        this.textTexture = null;
        this.textMaterial = null;
    }
    create(cfg) {
        const { ctx, canvas } = this;
        canvas.width = this.baseSize * cfg.width;
        canvas.height = this.baseSize * cfg.height;

        ctx.fillStyle = "hsla(0, 10%, 10%, 1)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.font = "320px Kryptonian";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        ctx.shadowColor = HSLAString(hexToHSLA("#00ff00"));
        ctx.shadowBlur = 5;
        ctx.fillStyle = HSLAString(hexToHSLA("#00ff00"));

        this.writeText(ctx, canvas, this.text);
    }
    writeText(ctx, canvas, txt) {
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText(txt, 0, 0);
        ctx.restore();        
    }
    update(dt) { //return;
        const { ctx, canvas } = this;
        const hue = mt_rand(20, 180);
        const c = { h: hue, s: 100, l:50, a: 1 };
        const hsla = HSLAString(c);
        ctx.shadowColor = hsla;
        
        ctx.fillStyle = "hsla(0, 10%, 10%, 1)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = hsla;
        this.writeText(ctx, canvas, this.text);
        this.textTexture.needsUpdate = true;
    }
    render(three, scene, cfg) {
        this.textTexture = new three.CanvasTexture(this.canvas);

        this.textMaterial = new three.MeshBasicMaterial({
            map: this.textTexture,
            transparent: true
        });

        this.textPlane = new three.Mesh(
           new three.PlaneGeometry(cfg.width, cfg.height),
           this.textMaterial
        );

        this.textPlane.position.set(0, cfg.height / 2, 0.51);

        scene.add(this.textPlane);

    }
}
