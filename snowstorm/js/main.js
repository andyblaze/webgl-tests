import Config from "./config.js";
import Perlin from "./perlin.js";
import ParticleSystem from "./particle-system.js";
import DeltaReport from "./delta-report.js";
import Eddy from "./eddy.js";
import Sheet from "./sheet.js";
import StormSystem from "./storm-system.js";

const config = new Config();
config.initCanvas("snow");

window.addEventListener("resize", config.resize);
config.resize();

const storm = new StormSystem(new Perlin(1337), config);
storm.addInfluence(new Sheet(60, 40, 400, 100));
storm.addInfluence(new Sheet(60, 40, 400, 100));
storm.addInfluence(new Sheet(60, 40, 400, 100));
storm.addInfluence(new Sheet(60, 40, 400, 100));
storm.addInfluence(new Eddy(config)); 
storm.addInfluence(new Eddy(config)); 
storm.addInfluence(new Eddy(config)); 
storm.addInfluence(new Eddy(config)); 

const particleSystem = new ParticleSystem(config); 

function drawGl(gl, t) {
t *= 0.001;

    gl.clearColor(
        0,
        0,
        0,
        0
    );

    gl.clear(
        gl.COLOR_BUFFER_BIT
    );

    gl.uniform2f(
        uResolution,
        glCanvas.width,
        glCanvas.height
    );

    gl.uniform1f(
        uTime,
        t
    );

    gl.uniform1f(
        uOpacity,
        glConfig.opacity
    );

    gl.uniform1f(
        uCloudHeight,
        glConfig.cloudHeight
    );

    gl.uniform1f(
        uNoiseScale,
        glConfig.noiseScale
    );

    gl.uniform2f(
        uDrift,
        glConfig.driftSpeedX,
        glConfig.driftSpeedY
    );

    gl.drawArrays(
        gl.TRIANGLE_STRIP,
        0,
        4
    );
}

class RampUp {
    constructor() {
        this.amount = 5;
        this.totalAmount = 400;
        this.done = false;
    }
    spawn(ps, storm) {
        for ( let i = 0; i < this.amount; i++ )
            ps.spawn();
        ps.update(storm);
        this.amount += 5;
        if ( this.amount >= this.totalAmount )
            this.done = true;
    }
}

const ramp = new RampUp();

function animate(timestamp) {

    requestAnimationFrame(animate);

    storm.update(timestamp); 
    drawGl(gl, timestamp);

    //config.ctx.fillStyle = `rgba(10,10,14,${config.backgroundFade})`;
    //config.ctx.fillRect(0, 0, config.canvasW, config.canvasH);
    config.ctx.clearRect(0, 0, config.canvasW, config.canvasH);

    // cloud layer
    const gradient = config.ctx.createLinearGradient(0, 0, 0, 250);
    gradient.addColorStop(0.0, "rgba(255, 255, 255, 0.35)");
    gradient.addColorStop(1.0, "rgba(255, 255, 255, 0)");

    config.ctx.fillStyle = gradient;
    config.ctx.fillRect(0, 0, config.canvasW, 250);

    const toSpawn = parseInt(storm.intensity * config.spawnRate);

    for (let i = 0; i < toSpawn; i++) {
        particleSystem.spawn();
    }

    particleSystem.update(storm); // also draws
    DeltaReport.log(timestamp);
}

animate(performance.now());