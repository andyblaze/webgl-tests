export default class Field {
    constructor(wells) {
        this.wells = wells;
    }
    update(t) {
        for ( let w of this.wells )
            w.update(t);
    }

    sample(x, y, z) {
        let h = 0;
        for ( let w of this.wells ) {
            h += w.influence(x, y, z);
        }
    //
    // Horizon attenuation
    //
    const minY = -60;
    const maxY = 60;

    let factor = 1 - ((y - minY) / (maxY - minY));

    // keep some activity on the horizon
    factor = 0.85 + (factor * 0.275);

    return h * factor;
    }
}
