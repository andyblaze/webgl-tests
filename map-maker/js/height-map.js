import TypeConverter from "./type-converter.js";

class Radial {
    static apply(amount, x, y, distance) {
        return {
            effectX: x + (distance - x) * amount,
            effectY: y + (distance - y) * amount
        };
    }
}

class Twist {
    static apply(amount, nx, ny, distance, size) {
        const centre = size / 2;
        const angle = (amount / 10) * distance;
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);

        // NEW: rotate the coordinates around the centre
        const tx = nx - centre;
        const ty = ny - centre;

        //const ttx = tx * cos - ty * sin + centre;
        //const tty = tx * sin + ty * cos + centre;  
        return {
            effectX: tx * cos - ty * sin + centre, 
            effectY: tx * sin + ty * cos + centre
        };
    }
}

class Blend {
    static apply(ui, noise) {
        let v = ui.height + noise * ui.perlin;
        v = ui.height + (v - ui.height) * ui.contrast;   
        return v;     
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
    applyRadial(amount, x, y, distance) {
        return {
            effectX: x + (distance - x) * amount,
            effectY: y + (distance - y) * amount
        };
    }
    applyTwist(amount, nx, ny, distance) {
        const centre = this.size / 2;
        const angle = (amount / 10) * distance;
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);

        // NEW: rotate the coordinates around the centre
        const tx = nx - centre;
        const ty = ny - centre;

        const ttx = tx * cos - ty * sin + centre;
        const tty = tx * sin + ty * cos + centre;  
        return {
            effectX: tx * cos - ty * sin + centre, 
            effectY: tx * sin + ty * cos + centre
        };   
    }
    generate(ui, bounds) {
        //const ui = this.getValues(ctrls);
        let v = 0;
        let nx = 0;
        let ny = 0;
        const centre = this.size / 2;

        for ( let y = 0; y < this.size; y++ ) {
            for (let x = 0; x < this.size; x++) {
                const i = x + y * this.size;

                const dx = x - centre; 
                const dy = y - centre; 
                const distance = Math.sqrt(dx * dx + dy * dy);

                /*const radial = this.applyRadial(ui.radial, x, y, distance);
                console.log(radial);
                nx = radial.effectX;
                ny = radial.effectY;*/

                /*const twist = this.applyTwist(ui.twist, nx, ny, distance);
                nx = twist.effectX;
                ny = twist.effectY;*/

                const noise = this.perlin.noise(nx * ui.scale, ny * ui.scale);
                v = ui.height + noise * ui.perlin;
                v = ui.height + (v - ui.height) * ui.contrast;

                this.data[i] = v;

                if (v < bounds.min) bounds.min = v;
                if (v > bounds.max) bounds.max = v;
            }
        }
    }
    postProcess(ui, bounds) {
        if ( ui.exaggeration > 0 ) {
            for ( let i = 0; i < this.data.length; i++ ) {
                v = (this.data[i] - bounds.min) / (bounds.max - bounds.min);
                this.data[i] = Math.max(0, Math.min(1, 0.5 + (v - 0.5) * ui.exaggeration));
            }
        } 
    }
    applyPerlin(amount, nx, ny) {
        const noise = this.perlin.noise(nx * amount, ny * amount);
        //let v = ui.height + noise * ui.perlin;
        //v = ui.height + (v - ui.height) * ui.contrast;        
        return noise;
    }
    update(ctrls) { 
        const ui = this.getValues(ctrls);
        const bounds = {
            min: Infinity,
            max: -Infinity
        };
        /*this.generate(ui, bounds);
        this.postProcess(ui, bounds);
        this.fillImage();
        return;*/
        let v = 0;
        let nx = 0;
        let ny = 0;
        let min = Infinity;
        let max = -Infinity;

        // NEW: centre of the height map 
        const centre = this.size / 2;

        for ( let y = 0; y < this.size; y++ ) {
            for (let x = 0; x < this.size; x++) {
                const i = x + y * this.size;

                const dx = x - centre; 
                const dy = y - centre; 
                const distance = Math.sqrt(dx * dx + dy * dy);

                const radial = Radial.apply(ui.radial, x, y, distance);
                nx = radial.effectX;
                ny = radial.effectY;

                const twist = Twist.apply(ui.twist, nx, ny, distance, this.size);
                nx = twist.effectX;
                ny = twist.effectY;

                const noise = this.perlin.noise(nx * ui.scale, ny * ui.scale);
                v = Blend.apply(ui, noise);

                this.data[i] = v;


                if (v < bounds.min) bounds.min = v;
                if (v > bounds.max) bounds.max = v;
            }
        }
        if ( ui.exaggeration > 0 ) {
            for ( let i = 0; i < this.data.length; i++ ) {
                v = (this.data[i] - bounds.min) / (bounds.max - bounds.min);
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
