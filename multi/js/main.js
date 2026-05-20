import Program from "./program.js";
import GlQuad from "./gl-quad.js";
import BufferManager from "./buffer-manager.js";
import Renderer from "./renderer.js";
import SceneChanger from "./scene-changer.js";
import Shutter from "./shutter.js";
import DeltaReport from "./delta-report.js";
import { byId } from "./functions.js";

// WEBGL SETUP
const canvas = byId("c");
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

const scenes = new Scenes(); // Scenes class is injected by php after being assembled

let scene = scenes.current();

// COMPILE
const program = new Program(gl);

program.make("feedback", scene.shader, vertShader);
program.make("copy", fragShaderCopy, vertShader);

// QUAD
const quad = new GlQuad(gl);

// RENDERING
const renderer = new Renderer(gl, scene.config, {
    "buffers": buffers, 
    "canvas": canvas,
    "quad": quad,
    "feedbackProgram": program.feedback,
    "copyProgram": program.copy
});

// SCENE CHANGES
const changer = new SceneChanger(scene, scenes, program, vertShader, renderer);
const shutter = new Shutter(byId("shutter"));
shutter.addObserver(changer);

// RAF LOOP
let lastTime = performance.now();
let dt = 0;

function render(now) {
    dt = (now - lastTime) / 1000;
    dt = Math.min(dt, 0.1);
    lastTime = now;

    shutter.update(dt);

    renderer.draw(now);
    DeltaReport.log(now);
    requestAnimationFrame(render);
}

render(performance.now());