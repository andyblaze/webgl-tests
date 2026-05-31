export default class StormSystem {
    constructor(p, cfg) {
        this.perlin = p;
        this.cfg = cfg;
        this.globalWind = 0;
        this.influences = [];
    }
    update(timestamp) {
        const storm = this.perlin.sample(timestamp * 0.0002);
        const signedNoise = (storm * 2) - 1
        this.globalWind = signedNoise * this.cfg.baseWindSpeed;
        for (const i of this.influences) {
            i.update();
        }
    }
    addInfluence(i) {
        this.influences.push(i);
    }
    sampleWind(x, y) {

        let windX = this.globalWind;
        let windY = 0;

        for (const i of this.influences) {

            const w = i.sample(x, y);

            windX += w.x;
            windY += w.y;
        }

        return {
            x: windX,
            y: windY
        };
    }
}
