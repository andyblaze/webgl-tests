import Config from "./config.js";
import Perlin from "./perlin.js";
import ParticleSystem from "./particle-system.js";
import DeltaReport from "./delta-report.js";
import Eddy from "./eddy.js";
import StormSystem from "./storm-system.js";

const config = new Config();
config.initCanvas("canvas");

window.addEventListener("resize", config.resize);
config.resize();

const storm = new StormSystem(new Perlin(1337), config);
storm.addEddy(new Eddy(800, 400, 150, 0.025)); 

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
    //DeltaReport.log(timestamp);
}

animate(performance.now());