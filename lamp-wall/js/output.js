export default class Output {
    constructor(three) {
        this.width = 512;
        this.height = 512;
        this.buffer = new Uint8Array(this.width * this.height * 4);
        this.elapsedDt = 0;
        this.canvas = document.createElement("canvas");
        this.canvas.width = 1024;
        this.canvas.height = 256;

        this.ctx = this.canvas.getContext("2d");

        this.texture = new three.CanvasTexture(this.canvas);

        this.debugMesh = new three.Mesh(
            new three.PlaneGeometry(7, 3),
            new three.MeshBasicMaterial({ map: this.texture })
        );
        this.debugMesh.position.set(7.5, -1, -1);
    }
    addToScene(scene) {
        scene.add(this.debugMesh);
    }

    drawSignal(value) {
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = "lime";
        this.ctx.font = "148px monospace";
        this.ctx.fillText(value, 20, 80);

        this.texture.needsUpdate = true;
    }
    update(dt, renderer, rt) {
        this.elapsedDt += dt;
        //console.log(this.elapsedDt < 1);
        if ( this.elapsedDt > 1 ) {
            renderer.readRenderTargetPixels(
                rt,
                0,
                0,
                this.width,
                this.height,
                this.buffer
            );

            let hash = 2166136261; // FNV-ish seed

            for ( let i = 0; i < this.buffer.length; i += 16 ) { // skip for speed
                hash ^= this.buffer[i];
                hash = Math.imul(hash, 16777619);
            }
            this.drawSignal(hash >>> 0);
            this.elapsedDt = 0;
        }
    }
}
