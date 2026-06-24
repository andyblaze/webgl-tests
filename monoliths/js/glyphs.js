export default class Glyphs {
    constructor(txt) {
        this.text = txt;
    }
    create(cnvs, ctx, txt) {
        cnvs.width = 256;
        cnvs.height = 1024;

        ctx.fillStyle = "hsla(0, 0%, 0%, 0)";
        ctx.fillRect(0, 0, cnvs.width, cnvs.height);

        ctx.font = "100px Kryptonian";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        ctx.shadowColor = "#00ff00";
        ctx.shadowBlur = 5;
        ctx.fillStyle = "#00ff00";

        ctx.save();
        ctx.translate(cnvs.width / 2, cnvs.height / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText(this.text, 0, 0);
        ctx.restore();
    }
    update() {

    }
    render(three, scene, cnvs, cfg) {
        const textTexture = new three.CanvasTexture(cnvs);

        const textMaterial = new three.MeshBasicMaterial({
            map: textTexture,
            transparent: true
        });

        this.textPlane = new three.Mesh(
           new three.PlaneGeometry(1.8, 7.2),
           textMaterial
        );

        this.textPlane.position.set(0, cfg.height / 2, 0.51);

        scene.add(this.textPlane);

    }
}
