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
        const connections = this.gearTrain.connections; 
        // update first wheel
        let initialDriver = connections[0].driver;
        initialDriver.update(dt);

        // then the other wheels
        for ( let i = 0; i < connections.length; i++ ) {
            const driven = connections[i].driven;   
            driven.update(dt);
        }
    }
}
