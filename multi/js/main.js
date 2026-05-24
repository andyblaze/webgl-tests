import { CONFIG } from "./config.js?r=1";
import Program from "./program.js?r=1";
import GlQuad from "./gl-quad.js?r=1";
import BufferManager from "./buffer-manager.js?r=1";
import Renderer from "./renderer.js?r=1";
import SceneChanger from "./scene-changer.js?r=1";
import Shutter from "./shutter.js?r=1";
import DeltaReport from "./delta-report.js?r=1";
import { byId } from "./functions.js?r=1";

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

const scenes = new Scenes(CONFIG); // Scenes class is injected by php after being assembled

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