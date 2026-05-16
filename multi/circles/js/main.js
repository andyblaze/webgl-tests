import { CONFIG } from "./config.js";
import Program from "./program.js";
import GlQuad from "./gl-quad.js";
import BufferManager from "./buffer-manager.js";
import Renderer from "./renderer.js";
import Shutter from "./shutter.js";
import DeltaReport from "./delta-report.js";

// WEBGL SETUP
const canvas = document.getElementById("c");
const gl = canvas.getContext("webgl", { premultipliedAlpha:false });

const buffers = new BufferManager(gl);

function resize(){
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);
    buffers.create(canvas.width, canvas.height);
}
addEventListener("resize", resize);
resize();

// COMPILE
const program = new Program(gl);

const feedbackProgram = program.make(fragShader, vertShader);
const copyProgram = program.make(fragShaderCopy, vertShader);

// QUAD
const quad = new GlQuad(gl);

// RENDERING
const renderer = new Renderer(gl, CONFIG, {
    "buffers": buffers, 
    "canvas": canvas,
    "quad": quad,
    "feedbackProgram": feedbackProgram,
    "copyProgram": copyProgram
});

const shutter = new Shutter(document.getElementById("shutter"));

let lastTime = performance.now();

function render(now) {
    let dt = (now - lastTime) / 1000;
    //dt = Math.min(dt, 3.0);
    lastTime = now;

    shutter.update(dt);

    renderer.draw(now);
    DeltaReport.log(now);
    requestAnimationFrame(render);
}

render(performance.now());