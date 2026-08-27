export default class RpmReporter {

    constructor(reporting=false, interval = 2) {
        this.lastReportTime = 0;
        this.reporting = reporting;
        this.interval = interval;
    }

    shouldReport(elapsed) {
        if ( false === this.reporting ) return false;
        if (elapsed - this.lastReportTime < this.interval) {
            return false;
        }

        this.lastReportTime = elapsed;
        return true;
    }

    log(name, gear) {
        console.log(name, gear.rpmReport);
    }
}
