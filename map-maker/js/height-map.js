import TypeConverter from "./type-converter.js";

export default class HeightMap {
    constructor(canvas, perlin) {
        this.size = 512;
        this.data = new Float32Array(this.size * this.size);
        this.image = canvas.createImage(this.size);
        this.observers = [];
        this.perlin = perlin;
    }
    addObserver(o) {
        this.observers.push(o);
    }
    notify() {
        for ( const o of this.observers ) {
            o.update(this.image);
        }
    }
    update(ctrls) { 
        const height = ctrls[0];
        const baseHeight = TypeConverter.convert(height.dataset.type, height.value);
        const prln = ctrls[1]; 
        const scaleCtrl = ctrls[2];
        const scale = parseFloat(scaleCtrl.value) * 0.15;
        const contrastCtrl = ctrls[4];
        const contrast = parseFloat(contrastCtrl.value);
        for ( let y = 0; y < this.size; y++ ) {
            for ( let x = 0; x < this.size; x++ ) {
                const i = x + y * this.size;
                let v = baseHeight + this.perlin.noise(x * scale, y * scale) * parseFloat(prln.value);
                v = 0.5 + (v - 0.5) * contrast;
                this.data[i] = v;
            }
        }
        this.fillImage();
    }
    fillImage() {
        for ( let i = 0; i < this.data.length; i++ ) {
            const v = Math.floor(this.data[i] * 255);
            const idx = i * 4;

            this.image.data[idx + 0] = v;
            this.image.data[idx + 1] = v;
            this.image.data[idx + 2] = v;
            this.image.data[idx + 3] = 255;
        }
        this.notify();
    }
}
