import Config from "./config.js";
import Perlin from "./perlin.js";
import ParticleSystem from "./particle-system.js";
import DeltaReport from "./delta-report.js";
import Eddy from "./eddy.js";
import Gust from "./gust.js";
import Downdraft from "./downdraft.js";
import StormSystem from "./storm-system.js";
import { drawGl } from "./functions.js";

const config = new Config("snow");

function resize() {
    config.canvas.width = window.innerWidth;
    config.canvas.height = window.innerHeight;   
    config.canvasW = config.canvas.width;
    config.canvasH = config.canvas.height;  
    glResize(config.canvasW, config.canvasH); 
}

window.addEventListener("resize", resize);
resize();

const storm = new StormSystem(new Perlin(1337), config);
for ( let i = 0; i < 4; i++ ) {
    storm.addInfluence(new Gust(config));
    storm.addInfluence(new Eddy(config));  
}
storm.addInfluence(new Downdraft(config));

const particleSystem = new ParticleSystem(config); 

// cloud layer
const gradient = config.ctx.createLinearGradient(0, 0, 0, 250);
gradient.addColorStop(0.0, "rgba(255, 255, 255, 0.35)");
gradient.addColorStop(1.0, "rgba(255, 255, 255, 0)");

function animate(timestamp) {

    requestAnimationFrame(animate);

    storm.update(timestamp); 
    drawGl(gl, timestamp);

    config.ctx.clearRect(0, 0, config.canvasW, config.canvasH);
    config.ctx.fillStyle = gradient;
    config.ctx.fillRect(0, 0, config.canvasW, 250);

    const toSpawn = parseInt(storm.intensity * config.spawnRate);

    for (let i = 0; i < toSpawn; i++) {
        particleSystem.spawn();
    }
    config.update();
    particleSystem.update(storm); // also draws
    DeltaReport.log(timestamp);
}

animate(performance.now());