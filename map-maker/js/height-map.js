import TypeConverter from "./type-converter.js";
import { Radial, Exaggeration, Twist, 
         Terrace, Blend, Warp, Blur, Ridge,
        Pinch, Shear, Wave, MultiPinch } from "./effects.js";

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
    postProcess(ui, bounds, height) {
        if ( ui.ridge !== 0 )
            Ridge.apply(this.data, ui.ridge);
        if ( ui.exaggeration !== 0 )
            Exaggeration.apply(this.data, ui.exaggeration, bounds, height);
        if ( ui.blur !== 0 )
            Blur.apply(this.data, this.size, ui.blur);
    }
    update(ctrls) { 
        const ui = this.getValues(ctrls);
        const bounds = { min: Infinity, max: -Infinity };
        let height = 0;
        let sampleX = 0;
        let sampleY = 0;

        // centre of the height map 
        const centre = this.size / 2;

        const coordinateEffects = [
            [ui.radial, Radial],
            [ui.twist, Twist],
            [ui.warp, Warp],
            [ui.pinch, Pinch],
            [ui.shear, Shear],
            [ui.wave, Wave],
            [ui.multipinch, MultiPinch]
        ];

        for ( let y = 0; y < this.size; y++ ) {
            for ( let x = 0; x < this.size; x++ ) {

                sampleX = x;
                sampleY = y;

                const dx = x - centre; 
                const dy = y - centre; 
                const distance = Math.sqrt(dx * dx + dy * dy);

                for (const [amount, effect] of coordinateEffects) {
                    if ( amount !== 0 ) {
                        effect.apply(amount, sampleX, sampleY, distance, this.size);
                        sampleX = effect.effectX;
                        sampleY = effect.effectY;
                    }
                }

                const noise = this.perlin.noise(sampleX * ui.scale, sampleY * ui.scale);
                height = Blend.apply(ui, noise);

                if ( ui.terrace !== 0 ) {
                    Terrace.apply(ui.terrace, height);
                    height = Terrace.effect;
                }

                const i = x + y * this.size;
                this.data[i] = height;

                if (height < bounds.min) bounds.min = height;
                if (height > bounds.max) bounds.max = height;
            }
        }
        this.postProcess(ui, bounds, height);
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
