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
        return h;
    }
}
