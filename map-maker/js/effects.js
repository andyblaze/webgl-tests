import { clamp0to1 } from "./functions.js";

export class Warp {
    static effectX = 0;
    static effectY = 0;
    static apply(amount, x, y, distance) {
        const frequency = 0.05;
        const offset = Math.sin(distance * 0.05) * amount;
        //Warp.effectX = x + Math.sin(distance * frequency) * amount;
        //Warp.effectY = y + Math.cos(distance * frequency) * amount;
        Warp.effectX = x + offset;
        Warp.effectY = y + offset;        
    }
}

export class Radial {
    static effectX = 0;
    static effectY = 0;
    static apply(amount, x, y, distance) {
        Radial.effectX = x + (distance - x) * amount;
        Radial.effectY = y + (distance - y) * amount;
    }
}

export class Twist {
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

export class Terrace {
    static effect = 0;
    static apply(amount, value) {
        const steps = 2 + amount * 30;
        Terrace.effect = Math.floor(value * steps) / steps;
    }
}

export class Ripple {
    static effect = 0;
    static apply(amount, value, distance) {
        Ripple.effect = value + Math.sin(distance * amount) * amount;
    }
}

export class Blend {
    static apply(ui, noise) {
        let v = ui.height + noise * ui.perlin;
        v = ui.height + (v - ui.height) * ui.contrast;   
        return v;     
    }
}

export class Exaggeration {
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

export class Pinch {
    static effectX = 0;
    static effectY = 0;
    static apply(amount, x, y, distance, size) {
        const centre = size / 2;
        const factor = 1 + amount * distance / centre;

        Pinch.effectX = centre + (x - centre) * factor;
        Pinch.effectY = centre + (y - centre) * factor;
    }
}

export class Wave {
    static effectX = 0;
    static effectY = 0;
    static apply(amount, x, y) {
        const frequency = 0.05;
        Wave.effectX = x + Math.sin(y * frequency) * amount;
        Wave.effectY = y + Math.sin(x * frequency) * amount;
    }
}

export class Shear {
    static effectX = 0;
    static effectY = 0;
    static apply(amount, x, y, size) {
        const centre = size / 2;
        Shear.effectX = x + (y - centre) * amount;
        Shear.effectY = y + (x - centre) * amount;
    }
}

export class Ridge {
    static apply(data, amount) {
        if (amount === 0) return;
        for (let i = 0; i < data.length; i++) {
            const v = data[i];
            const ridge = 1 - Math.abs(2 * v - 1);
            data[i] = v + (ridge - v) * amount;
        }
    }
}

export class Blur {
    static buffer = null;
    static apply(data, size, amount) {
        if (!Blur.buffer || Blur.buffer.length !== data.length) {
            Blur.buffer = new Float32Array(data.length);
        }
        const passes = Math.floor(amount);

        for ( let pass = 0; pass < passes; pass++ ) {
            for ( let y = 0; y < size; y++ ) {
                for ( let x = 0; x < size; x++ ) {

                    const left  = x > 0 ? x - 1 : x;
                    const right = x < size - 1 ? x + 1 : x;
                    const up    = y > 0 ? y - 1 : y;
                    const down  = y < size - 1 ? y + 1 : y;

                    const i = x + y * size;

                    Blur.buffer[i] =
                        (
                            data[left + y * size] +
                            data[right + y * size] +
                            data[x + up * size] +
                            data[x + down * size] +
                            data[i]
                        ) / 5;
                }
            }
            data.set(Blur.buffer);
        }
    }
}
