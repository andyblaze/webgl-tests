import { BufferAttribute } from "three";

export default class Attributes {
    constructor() {
        this.attribs = {};
    }
    add(atts) {
        Object.assign(this.attribs, atts);
    }
    set(index, key, val) {
        this.attribs[key].array[index] = val;
    }
    setColor(index, key, color) {
        const i3 = index * 3;
        this.attribs[key].array[i3] = color.r;
        this.attribs[key].array[i3 + 1] = color.g;
        this.attribs[key].array[i3 + 2] = color.b;        
    }
    applyTo(geometry, count) {
        for ( const [key, val] of Object.entries(this.attribs) ) {
            geometry.setAttribute(
                key,
                new BufferAttribute(val.array, val.size)
            );
        }
        geometry.setAttribute(
            'position',
            new BufferAttribute(
                new Float32Array(count * 3), 3
            )
        );
    }
}
