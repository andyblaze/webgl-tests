export default class Clock {
    constructor(three, gt, rpmReport) {
        this.visuals = [];
        this.gears = new three.Group();
        this.gearTrain = gt;
        this.rpmReport = rpmReport;
    }
    addItem(i) {
        this.visuals.push(i);
        this.gears.add(i.native); 
        /* !!!!!!!!!!!!!!!!!!!!!! */                            //console.log(Math.random());
    }
    update(dt, elapsed) {
        this.gearTrain.update(dt, elapsed);
        if ( this.rpmReport.shouldReport(elapsed) ) {
            for ( let i = 0; i < this.visuals.length; i++ )
                this.rpmReport.log(this.visuals[i].name, this.visuals[i]);
            //this.rpmReport.log("gear1:", this.visuals[0]);
            //this.rpmReport.log("gear2:", this.visuals[1]);
            //this.rpmReport.log("gear3:", this.visuals[2]);
            //this.rpmReport.log("gear4:", this.visuals[3]);
        }
    }
}
