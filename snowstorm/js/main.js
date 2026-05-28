import Config from "./config.js";
import Perlin from "./perlin.js";
import ParticleSystem from "./particle-system.js";
import DeltaReport from "./delta-report.js";

const config = new Config();
config.initCanvas("canvas");

window.addEventListener("resize", config.resize);
config.resize();

const stormNoise = new Perlin(1337);

const particleSystem = new ParticleSystem(config);

function animate(timestamp) {

    requestAnimationFrame(animate);

    const storm = stormNoise.sample(timestamp * 0.0002);
    const signedNoise = (storm * 2) - 1
    config.windSpeed = signedNoise * config.baseWindSpeed;

    config.ctx.fillStyle = `rgba(10,10,14,${config.backgroundFade})`;
    config.ctx.fillRect(0, 0, config.canvasW, config.canvasH);

    for (let i = 0; i < config.spawnRate; i++) {
        particleSystem.spawn();
    }

    particleSystem.update(); // also draws
    DeltaReport.log(timestamp);
}

animate(performance.now());