export default class World {
    constructor() {
        this.items = [];
    }
    update(time) {
        for ( const i of this.items ) {
            i.update(time.dt);
        }
    }
    add(item_s) {
        if ( Array.isArray(item_s) )
            this.items = item_s;
        else 
            this.items.push(item_s);
    }
}
