import TypeConverter from "./type-converter.js";
import { clamp0to1 } from "./functions.js";

class Radial {
    static effectX = 0;
    static effectY = 0;
    static apply(amount, x, y, distance) {
        Radial.effectX = x + (distance - x) * amount;
        Radial.effectY = y + (distance - y) * amount;
    }
}

class Twist {
    static effectX = 0;
    static effectY = 0;    
    static apply(amount, nx, ny, distance, size) {
        const centre = size / 2;
        const angle = (amount / 10) * distance;
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);

        // NEW: rotate the coordinates around the centre
        const tx = nx - centre;
        const ty = ny - centre;
 
        Twist.effectX = tx * cos - ty * sin + centre;
        Twist.effectY = tx * sin + ty * cos + centre;
    }
}

class Terrace {
    static effect = 0;
    static apply(amount, value) {
        const steps = 2 + amount * 30;
        Terrace.effect = Math.floor(value * steps) / steps;
    }
}

class Ripple {
    static effect = 0;
    static apply(amount, value, distance) {
        Ripple.effect = value + Math.sin(distance * amount) * amount;
    }
}

class Blend {
    static apply(ui, noise) {
        let v = ui.height + noise * ui.perlin;
        v = ui.height + (v - ui.height) * ui.contrast;   
        return v;     
    }
}

class Exaggeration {
    static apply(data, amount, bounds, v) {
        if ( amount > 0 ) {
            for ( let i = 0; i < data.length; i++ ) {
                v = (data[i] - bounds.min) / (bounds.max - bounds.min);
                //data[i] = Math.max(0, Math.min(1, 0.5 + (v - 0.5) * amount));
                data[i] = clamp0to1(0.5 + (v - 0.5) * amount);
            }
        }         
    }
}

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
    postProcess(ui, bounds, v) {
        Exaggeration.apply(this.data, ui.exaggeration, bounds, v);
    }
    update(ctrls) { 
        const ui = this.getValues(ctrls);
        const bounds = { min: Infinity, max: -Infinity };
        let v = 0;
        let nx = 0;
        let ny = 0;

        // centre of the height map 
        const centre = this.size / 2;

        for ( let y = 0; y < this.size; y++ ) {
            for ( let x = 0; x < this.size; x++ ) {

                const dx = x - centre; 
                const dy = y - centre; 
                const distance = Math.sqrt(dx * dx + dy * dy);

                Radial.apply(ui.radial, x, y, distance);
                nx = Radial.effectX;
                ny = Radial.effectY;

                Twist.apply(ui.twist, nx, ny, distance, this.size);
                nx = Twist.effectX;
                ny = Twist.effectY;

                const noise = this.perlin.noise(nx * ui.scale, ny * ui.scale);
                v = Blend.apply(ui, noise);

                Terrace.apply(ui.terrace, v);
                v = Terrace.effect;

                Ripple.apply(ui.ripple, v, distance);
                v = Ripple.effect;

                const i = x + y * this.size;
                this.data[i] = v;

                if (v < bounds.min) bounds.min = v;
                if (v > bounds.max) bounds.max = v;
            }
        }
        this.postProcess(ui, bounds, v);
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
