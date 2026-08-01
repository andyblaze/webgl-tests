import * as THREE from "./three.module.js";
import DeltaReport from "./delta-report.js";
import Config from "./config.js";
import UiControls from "./ui-controls.js";
import Renderer from "./renderer.js";
import Camera from "./camera.js";
import Model from "./model.js";
import Lighting from "./lighting.js";

const config = new Config("workspace");

const uiControls = new UiControls();
uiControls.add("#material input", config);
uiControls.addObserver(config);
//uiControls.notify();

const renderer = new Renderer(THREE, config);
const scene = new THREE.Scene();
const lighting = new Lighting(THREE);
const camera = new Camera(THREE, 60, config.aspectRatio, 0.1, 100);
const model = new Model(THREE, config);

for ( const light of lightsCfg )
    lighting.addLight(scene, light);

config.addObserver("material", model);

const shape = model.native;
const cam = camera.native;

scene.add(shape);

const clock = new THREE.Clock();

function animate(timestamp) {    
    const dt = clock.getDelta(); 
    const elapsedTime = clock.getElapsedTime();
    shape.rotation.x += 0.002;
    shape.rotation.y += 0.005;
    shape.rotation.z += 0.001;

    renderer.render(scene, cam);

    DeltaReport.log(timestamp);
    requestAnimationFrame(animate);
}

animate(performance.now());