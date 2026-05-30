export default class StormSystem {
    constructor(p, cfg) {
        this.perlin = p;
        this.cfg = cfg;
        this.globalWind = 0;
        this.eddies = [];
    }
    update(timestamp) {
        const storm = this.perlin.sample(timestamp * 0.0002);
        const signedNoise = (storm * 2) - 1
        this.globalWind = signedNoise * this.cfg.baseWindSpeed;
    }
    addEddy(e) {
        this.eddies.push(e);
    }
    sampleWind(x, y) {

        let windX = this.globalWind;
        let windY = 0;

        for (const eddy of this.eddies) {

            const w = eddy.sample(x, y);

            windX += w.x;
            windY += w.y;
        }

        return {
            x: windX,
            y: windY
        };
    }
}
