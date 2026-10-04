import { byId, byQsArray } from "./functions.js";
/*import Emitter from "./emitter.js";
import TypeConverter from "./typeconverter.js";
import Cfg from "./config.js";*/
import UiControls from "./uicontrols.js";
/*import IO from "./io.js";
import RendererFactory from "./renderer-factory.js";
import ParticleForces from "./particle-forces.js";
import TooltipHelp from "./tooltips.js";
import DeltaReport from "./delta-report.js";
import DeviceTester from "./device-tester.js";
import OffScreenCanvas from "./offscreen-canvas.js";*/

/*const device = new DeviceTester("screen-warning", "continue-btn"); 
device.test(); */

function perlin(x, y) {

    // Integer coordinates
    const x0 = Math.floor(x);
    const y0 = Math.floor(y);

    // Fractional coordinates
    const xf = x - x0;
    const yf = y - y0;

    // Cheap pseudo-random value for each grid point
    function random(ix, iy) {
        const n = Math.sin(ix * 127.1 + iy * 311.7) * 43758.5453;
        return (n - Math.floor(n)) * 2 - 1;
    }

    // Smooth interpolation
    function smooth(t) {
        return t * t * (3 - 2 * t);
    }

    const sx = smooth(xf);
    const sy = smooth(yf);

    // Four corners
    const n00 = random(x0,     y0);
    const n10 = random(x0 + 1, y0);
    const n01 = random(x0,     y0 + 1);
    const n11 = random(x0 + 1, y0 + 1);

    // Interpolate horizontally
    const nx0 = n00 + (n10 - n00) * sx;
    const nx1 = n01 + (n11 - n01) * sx;

    // Interpolate vertically
    return nx0 + (nx1 - nx0) * sy;
}

class Canvas {
    constructor(id) {
        this.canvas = byId(id);
        this.ctx = this.canvas.getContext("2d");
    }
    createImage(size) {
        return this.ctx.createImageData(size, size);
    }
    update(image) {
        this.ctx.putImageData(image, 0, 0);        
    }
}

class TypeConverter {
    static convert(type, val) {
        if ( type === "float" ) return parseFloat(val);
        if ( type === "perlin" ) return perlin(val);
    }
}

class HeightMap {
    constructor(canvas) {
        this.size = 512;
        this.heightMap = new Float32Array(this.size * this.size);
        this.image = canvas.createImage(this.size);
        this.observers = [];
    }
    addObserver(o) {
        this.observers.push(o);
    }
    notify() {
        for ( const o of this.observers ) {
            o.update(this.image);
        }
    }
    update(ctrls) { 
        const height = ctrls[0]; // so far I have only one control - height.
        const baseHeight = TypeConverter.convert(height.dataset.type, height.value);
        //this.heightMap.fill(val);
        const prln = ctrls[1]; 
        const scaleCtrl = ctrls[2];
        const scale = parseFloat(scaleCtrl.value) * 0.15;
        for ( let y = 0; y < this.size; y++ ) {
            for ( let x = 0; x < this.size; x++ ) {
                const i = x + y * this.size;
                this.heightMap[i] = baseHeight + perlin(x * scale, y * scale) * parseFloat(prln.value);
            }
        }
        this.fillImage();
    }
    fillImage() {
        for ( let i = 0; i < this.heightMap.length; i++ ) {
            const v = Math.floor(this.heightMap[i] * 255);
            const idx = i * 4;

            this.image.data[idx + 0] = v;
            this.image.data[idx + 1] = v;
            this.image.data[idx + 2] = v;
            this.image.data[idx + 3] = 255;
        }
        this.notify();
    }
}

const canvas = new Canvas("cnvsMap");
const heightMap = new HeightMap(canvas);
heightMap.addObserver(canvas);

const uiControls = new UiControls("#ui-ctrls input");
uiControls.addObserver(heightMap);
uiControls.notify();

byId("ui-ctrls").reset();

/*if ( byId("export") ) 
    byId("export").onclick = () => IO.export(config);
byId("import").onclick = () => {
    emitter.clear();
    config.ctx.clearRect(0, 0, config.canvasWidth, config.canvasHeight);
    IO.import(config, uiControls);
};

const emitter = new Emitter(config.canvasCenter.x, config.canvasCenter.y);

const rendererFactory = new RendererFactory(byId("renderer-select"), config);

const offScreen = new OffScreenCanvas(config);

let renderer = rendererFactory.init(config);
byId("renderer-select").onchange = () => { 
    emitter.clear();
    config.ctx.clearRect(0, 0, config.canvasWidth, config.canvasHeight);
    offScreen.clear();
    renderer = rendererFactory.change(); 
}   

const forces = new ParticleForces(config);

TooltipHelp.init(".help", ".help-tooltip");

let lastTimestamp = 0;
function loop(timestamp) {    
    if ( lastTimestamp === 0 ) lastTimestamp = timestamp;
    const dt = (timestamp - lastTimestamp) / 16.666; // 16.666 ms ~ 60 FPS
    lastTimestamp = timestamp;

    // --- fade the offscreen canvas to create trails ---
    offScreen.ctx.globalCompositeOperation = "source-over";
    offScreen.ctx.fillStyle = `rgba(0, 0, 0, ${config.bg_opacity})`;
    offScreen.ctx.fillRect(0, 0, config.canvasWidth, config.canvasHeight);

    emitter.update(config, dt); 
    forces.apply(emitter.particles);
    //renderer.draw(emitter.particles, config.ctx);
    renderer.draw(emitter.particles, offScreen.ctx);

    // --- blit offscreen canvas onto visible canvas ---
    config.ctx.clearRect(0, 0, config.canvasWidth, config.canvasHeight); // optional, just ensures clean frame
    config.ctx.drawImage(offScreen.canvas, 0, 0);
    DeltaReport.log(timestamp, emitter.getSize());
    requestAnimationFrame(loop);
}

requestAnimationFrame(loop);*/
