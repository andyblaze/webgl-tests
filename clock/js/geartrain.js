export default class GearTrain {
    constructor() {
        this.connections = [];
    }
    connect(gear1, gear2) {
        //const r = driver.toothCount / driven.toothCount;
        this.connections.push({
            driver: gear1,
            driven: gear2,
            ratio: gear1.toothCount / gear2.toothCount
        });
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
