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
    getValues(ctrls) {
        let result = {};
        for ( const [key, ctrl] of Object.entries(ctrls) ) {
            result[key] = TypeConverter.convert(ctrl.dataset.type, ctrl.value);
        }
        return result;
    }
    update(ctrls) { 
        const ui = this.getValues(ctrls);
        /*const heightCtrl = ctrls.height;
        const baseHeight = TypeConverter.convert(heightCtrl.dataset.type, heightCtrl.value);
        const perlinCtrl = ctrls.perlin; 
        const perlinAmount = TypeConverter.convert(perlinCtrl.dataset.type, perlinCtrl.value);
        const scaleCtrl = ctrls.scale;
        const scale = TypeConverter.convert(scaleCtrl.dataset.type, scaleCtrl.value) * 0.15;
        const contrastCtrl = ctrls.contrast;
        const contrast = TypeConverter.convert(contrastCtrl.dataset.type, contrastCtrl.value);
        const exaggerationCtrl = ctrls.exaggeration;
        const exaggeration = TypeConverter.convert(exaggerationCtrl.dataset.type, exaggerationCtrl.value);*/
        let min = Infinity;
        let max = -Infinity;
        let v = 0;

        for ( let y = 0; y < this.size; y++ ) {
            for (let x = 0; x < this.size; x++) {
                const i = x + y * this.size;

                const noise = this.perlin.noise(x * ui.scale, y * ui.scale);
                v = ui.height + noise * ui.perlin;
                v = ui.height + (v - ui.height) * ui.contrast;

                this.data[i] = v;

                if (v < min) min = v;
                if (v > max) max = v;
            }
        }
        if ( ui.exaggeration > 0 ) {
            for ( let i = 0; i < this.data.length; i++ ) {
                v = (this.data[i] - min) / (max - min);
                this.data[i] = Math.max(0, Math.min(1, 0.5 + (v - 0.5) * ui.exaggeration));
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
