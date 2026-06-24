import { hexToHSLA, HSLAString, mt_rand } from "./functions.js";

export default class Glyphs {
    constructor(txt) {
        this.text = txt;
        this.textTexture = null;
        this.textMaterial = null;
    }
    create(cnvs, ctx, txt) {
        cnvs.width = 256;
        cnvs.height = 1024;

        ctx.fillStyle = "hsla(0, 0%, 0%, 0)";
        ctx.fillRect(0, 0, cnvs.width, cnvs.height);

        ctx.font = "100px Kryptonian";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        ctx.shadowColor = HSLAString(hexToHSLA("#00ff00"));
        ctx.shadowBlur = 5;
        ctx.fillStyle = HSLAString(hexToHSLA("#00ff00"));

        ctx.save();
        ctx.translate(cnvs.width / 2, cnvs.height / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText(this.text, 0, 0);
        ctx.restore();
    }
    update(dt, cnvs, ctx) { return;
        const hue = mt_rand(20, 180);
        const c = { h: hue, s: 100, l:50, a: 1 };
        const hsla = HSLAString(c);
        ctx.shadowColor = hsla;
        
        ctx.fillStyle = "hsla(0, 0%, 0%, 0)";
        ctx.fillRect(0, 0, cnvs.width, cnvs.height);
        ctx.fillStyle = hsla;
        ctx.save();
        ctx.translate(cnvs.width / 2, cnvs.height / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText(this.text, 0, 0);
        ctx.restore();
        this.textTexture.needsUpdate = true;
    }
    render(three, scene, cnvs, cfg) {
        this.textTexture = new three.CanvasTexture(cnvs);

        this.textMaterial = new three.MeshBasicMaterial({
            map: this.textTexture,
            transparent: true
        });

        this.textPlane = new three.Mesh(
           new three.PlaneGeometry(1.8, 7.2),
           this.textMaterial
        );

        this.textPlane.position.set(0, cfg.height / 2, 0.51);

        scene.add(this.textPlane);

    }
}
