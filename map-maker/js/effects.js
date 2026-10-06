import { clamp0to1 } from "./functions.js";

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
