export default class World {
    constructor(scene) {
        this.scene = scene;
        this.items = [];
    }
    add(items) {
        if (Array.isArray(items)) {
            items.forEach(item => this.add(item));
        } else {
            items.addTo(this.scene);
            this.items.push(items);
        }
        return this;
    }
    addLighting(lights) {
        this.items.push(lights);
        return this;
    }
    update(time) {
        for ( const item of this.items )
            item.update(time);
    }
}
