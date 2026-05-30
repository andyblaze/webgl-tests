import Config from "./config.js";
import Perlin from "./perlin.js";
import ParticleSystem from "./particle-system.js";
import DeltaReport from "./delta-report.js";

const config = new Config();
config.initCanvas("canvas");

window.addEventListener("resize", config.resize);
config.resize();

class Eddy {

    constructor(x, y, radius, strength = 0.05) {

        this.x = x;
        this.y = y;
        this.radius = radius;
        // positive = clockwise
        // negative = anticlockwise
        this.strength = strength;
    }
    // returns wind vector at a position
    sample(px, py) {
        const dx = px - this.x;
        const dy = py - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // outside influence
        if (dist > this.radius) {
            return { x: 0, y: 0 };
        }
        // normalize distance
        const t = dist / this.radius;

        // falloff: strongest at center, weakest at edge
        const force = (1 - t) * this.strength;

        // perpendicular vector creates rotation
        let vx = -dy;
        let vy = dx;
        // normalize vector
        const len = Math.sqrt(vx * vx + vy * vy);

        if (len > 0) {
            vx /= len;
            vy /= len;
        }
        // apply strength
        vx *= force;
        vy *= force;

        return {
            x: vx,
            y: vy
        };
    }
}

class StormSystem {
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

const storm = new StormSystem(new Perlin(1337), config);
storm.addEddy(new Eddy(800, 400, 150, 0.025)); 
console.log(StormSystem.prototype);

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