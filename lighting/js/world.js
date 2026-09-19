export default class World {
    constructor(scene) {
        this.scene = scene;
        this.items = [];
    }
    add(item) {
        if ( item.addTo && typeof item.addTo === "function" )
            item.addTo(this.scene);
        this.items.push(item);
        return this;
    }
    update(time) {
        for ( const item of this.items )
            item.update(time);
    }
}
