export function byId(id) {
    return document.getElementById(id);
}

export function byQs(selector, parent = document) { 
    return parent.querySelector(selector); 
}
export function byQsArray(selector, parent = document) { 
    return Array.from(parent.querySelectorAll(selector)); 
}

export function mt_rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function mt_randf(min, max) {
    return Math.random() * (max - min) + min;
}

export function randomFrom(arr) {
    return arr[mt_rand(0, arr.length - 1)];
}

export function lerp(a, b, t) {
    return a + (b - a) * t;
} 

export function randHSLA(hRange, sRange, lRange, aRange) {
    const h = mt_randf(hRange[0], hRange[1]);
    const s = mt_randf(sRange[0], sRange[1]);
    const l = mt_randf(lRange[0], lRange[1]);
    const a = mt_randf(aRange[0], aRange[1]);
    return `hsla(${h},${s}%,${l}%,${a})`;
}

export function lerpHSLAColor(c1, c2, t) {
    return {
        h: lerp(c1.h, c2.h, t),
        s: lerp(c1.s, c2.s, t),
        l: lerp(c1.l, c2.l, t),
        a: lerp(c1.a, c2.a, t)
    };
}

export function hexToHSLA(hex) {
    // Remove leading #
    hex = hex.replace(/^#/, "");

    // Parse r,g,b
    let r = parseInt(hex.substring(0,2), 16) / 255;
    let g = parseInt(hex.substring(2,4), 16) / 255;
    let b = parseInt(hex.substring(4,6), 16) / 255;

    // Find min/max
    const max = Math.max(r,g,b);
    const min = Math.min(r,g,b);
    let h, s, l;
    l = (max + min) / 2;

    if (max === min) {
        h = s = 0; // achromatic
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        switch(max) {
            case r: h = ( (g - b) / d + (g < b ? 6 : 0) ); break;
            case g: h = ( (b - r) / d + 2 ); break;
            case b: h = ( (r - g) / d + 4 ); break;
        }
        h *= 60;
    }

    // Return object with alpha = 1
    return { h: Math.round(h), s: Math.round(s*100), l: Math.round(l*100), a: 1 };
}

export function hslaToHex({h, s, l, a}) {
    s /= 100;
    l /= 100;
    const c = (1 - Math.abs(2*l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c/2;
    let r=0, g=0, b=0;

    if (0 <= h && h < 60) [r,g,b] = [c,x,0];
    else if (60 <= h && h < 120) [r,g,b] = [x,c,0];
    else if (120 <= h && h < 180) [r,g,b] = [0,c,x];
    else if (180 <= h && h < 240) [r,g,b] = [0,x,c];
    else if (240 <= h && h < 300) [r,g,b] = [x,0,c];
    else if (300 <= h && h < 360) [r,g,b] = [c,0,x];

    r = Math.round((r + m)*255);
    g = Math.round((g + m)*255);
    b = Math.round((b + m)*255);

    // ignore alpha for color input, it can’t use it
    return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`;
}

export function HSLAString(c) {
    return `hsla(${c.h},${c.s}%,${c.l}%,${c.a})`;
}
