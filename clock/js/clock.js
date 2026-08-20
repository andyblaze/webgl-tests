export default class Clock {
    constructor(three) {
        this.objects = [];
        this.gears = new three.Group()
    }
    addItem(i) {
        this.objects.push(i);
        this.gears.add(i.native);
    }
    update(dt, elapsed) {
        const gear1 = this.objects[0];
        const gear2 = this.objects[1];

        const vel = gear1.velocity * dt;

        gear1.update(vel);

        const gear2Vel = -vel * (gear1.toothCount / gear2.toothCount);

        gear2.update(gear2Vel);
    }
}
