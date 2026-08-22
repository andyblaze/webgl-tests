export default class Clock {
    constructor(three, gt) {
        this.visuals = [];
        this.gears = new three.Group();
        this.gearTrain = gt;
    }
    addItem(i) {
        this.visuals.push(i);
        this.gears.add(i.native);
    }
    update(dt, elapsed) {
        const connections = this.gearTrain.connections; // the gear connections
        // update the first gear
        let visual = this.visuals[0];
        let rotationDelta = visual.velocity * dt;
        visual.update(rotationDelta);

        // gears.length is 3, visuals.length is 4
        for ( let i = 0; i < connections.length; i++ ) {
            visual = this.visuals[i+1];  // visuals 0 was updated above, so add 1                  
            rotationDelta = -rotationDelta * connections[i].ratio;
            visual.update(rotationDelta);
        }
    }
}
