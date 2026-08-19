export default class Clock {
    constructor(three) {
        this.objects = [];
        this.items = new three.Group()
    }
    addItem(i) {
        this.objects.push(i);
        this.items.add(i.native);
        //console.log(this.items);
    }
    update() {
        let vel = this.objects[0].speed * this.objects[0].direction;
        this.objects[0].update(vel);
        this.objects[1].update(-vel);
    }
}
