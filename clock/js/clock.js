export default class Clock {
    constructor(three, gt) {
        this.visuals = [];
        this.gears = new three.Group();
        this.gearTrain = gt;
    }
    addItem(i) {
        this.visuals.push(i);
        this.gears.add(i.native); 
        console.log(Math.random());
    }
    update(dt, elapsed) {
        const connections = this.gearTrain.connections; // the gear connections
        let initialDriver = connections[0].driver;
        // update the first gear
        let rotationDelta = initialDriver.velocity * dt;
        initialDriver.update(rotationDelta);

        for ( let i = 0; i < connections.length; i++ ) {
            const driven = connections[i].driven;             
            rotationDelta = -rotationDelta * connections[i].ratio;
            driven.update(rotationDelta);
        }
    }
}
