import Config from "./config.js";
import Perlin from "./perlin.js";
import ParticleSystem from "./particle-system.js";
import DeltaReport from "./delta-report.js";

const config = new Config();
config.initCanvas("canvas");

window.addEventListener("resize", config.resize);
config.resize();

class StormSystem {
    constructor(p, cfg) {
        this.perlin = p;
        this.cfg = cfg;
        this.globalWind = 0;
    }
    update(timestamp) {
        const storm = this.perlin.sample(timestamp * 0.0002);
        const signedNoise = (storm * 2) - 1
        this.globalWind = signedNoise * this.cfg.baseWindSpeed;
    }
}

const storm = new StormSystem(new Perlin(1337), config);

const particleSystem = new ParticleSystem(config);

function animate(timestamp) {

    requestAnimationFrame(animate);

    storm.update(timestamp); 

    config.ctx.fillStyle = `rgba(10,10,14,${config.backgroundFade})`;
    config.ctx.fillRect(0, 0, config.canvasW, config.canvasH);

    for (let i = 0; i < config.spawnRate; i++) {
        particleSystem.spawn();
    }

    particleSystem.update(storm); // also draws
    DeltaReport.log(timestamp);
}

animate(performance.now());