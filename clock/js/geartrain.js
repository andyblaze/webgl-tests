export default class GearTrain {
    constructor() {
        this.connections = [];
    }
    connect(drvr, drvn, ratioOverride=0) {
        this.connections.push({
            driver: drvr,
            driven: drvn,
            ratio: ratioOverride === 0 ? drvr.toothCount / drvn.toothCount : ratioOverride
        });
        return this;
    }
    get size() {
        return this.connections.length;
    }
    init() {
        for ( let i = 0; i < this.connections.length; i++ ) {
            const driver = this.connections[i].driver; 
            const driven = this.connections[i].driven;   
            driven.direction = -driver.direction;
            driven.velocity = driver.velocity * this.connections[i].ratio;
        }
    }
    update(dt, elapsed) {
        // update first wheel
        let initialDriver = this.connections[0].driver;
        initialDriver.update(dt);

        // then the other wheels
        for ( let i = 0; i < this.connections.length; i++ ) {
            const driven = this.connections[i].driven;   
            driven.update(dt);
        }
    }
}
