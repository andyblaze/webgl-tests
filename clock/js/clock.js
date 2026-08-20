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
        let rotationDelta = this.objects[0].velocity * dt;

        for (let i = 0; i < this.objects.length; i++) {
            const gear = this.objects[i];
            gear.update(rotationDelta);

            if (i < this.objects.length - 1) {
                const nextGear = this.objects[i + 1];
                rotationDelta = -rotationDelta * (gear.toothCount / nextGear.toothCount);
            }
        }
    }
}
