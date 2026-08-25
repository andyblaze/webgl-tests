export default class Clock {
    constructor(three, gt) {
        this.visuals = [];
        this.gears = new three.Group();
        this.gearTrain = gt;
    }
    addItem(i) {
        this.visuals.push(i);
        this.gears.add(i.native); 
        /* !!!!!!!!!!!!!!!!!!!!!! */                            console.log(Math.random());
    }
    update(dt, elapsed) {
        this.gearTrain.update(dt, elapsed);
    }
}
