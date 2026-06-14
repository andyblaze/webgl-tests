export default class Mesh {
    constructor(p) {
        this.positions = p;
    }
    update(t, field) {
        for ( let i = 0; i < this.positions.count; i++ ) {
            //let height = 0;

            const ox = this.positions.getX(i);
            const oy = this.positions.getY(i);
            const oz = this.positions.getZ(i);

            //height = ;
            this.positions.setZ(i, field.sample(ox, oy, oz));
        }
        this.positions.needsUpdate = true;        
    }
}
