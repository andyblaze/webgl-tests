import { CONFIG } from "./config.js";
import Program from "./program.js";
import GlQuad from "./gl-quad.js";
import BufferManager from "./buffer-manager.js";
import Renderer from "./renderer.js";
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

// FBO SETUP
//buffers.create(canvas.width, canvas.height);

// RENDERING
const renderer = new Renderer(gl, CONFIG, {
    "buffers": buffers, 
    "canvas": canvas,
    "quad": quad,
    "feedbackProgram": feedbackProgram,
    "copyProgram": copyProgram
});

function render(t) {
    renderer.draw(t);
    DeltaReport.log(t);
    requestAnimationFrame(render);
}

render(performance.now());