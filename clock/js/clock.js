export default class Clock {
    constructor(three, gt, rpmReport) {
        this.gears = [];
        this.visuals = new three.Group();
        this.gearTrain = gt;
        this.rpmReport = rpmReport;
    }
    addItem(i) {
        this.gears.push(i);
        this.visuals.add(i.native); 
        return this;
        /* !!!!!!!!!!!!!!!!!!!!!! */                            //console.log(Math.random());
    }
    update(dt, elapsed) {
        this.gearTrain.update(dt, elapsed);
        if ( this.rpmReport.shouldReport(elapsed) ) {
            for ( let i = 0; i < this.gears.length; i++ ) {
                const gear = this.gears[i];
                this.rpmReport.log(gear.name, gear);
            }
            //this.rpmReport.log("gear1:", this.visuals[0]);
            //this.rpmReport.log("gear2:", this.visuals[1]);
            //this.rpmReport.log("gear3:", this.visuals[2]);
            //this.rpmReport.log("gear4:", this.visuals[3]);
        }
    }
}
