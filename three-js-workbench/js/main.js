import * as THREE from "./three.module.js";
import DeltaReport from "./delta-report.js";
import Config from "./config.js";
import UiControls from "./ui-controls.js";
import Renderer from "./renderer.js";
import Camera from "./camera.js";
import Model from "./model.js";
import Lighting from "./lighting.js";

const config = new Config("workspace");

const uiControls = new UiControls("#material input");
uiControls.addObserver(config);
uiControls.notify();

const renderer = new Renderer(THREE, config);
const scene = new THREE.Scene();
const lighting = new Lighting(THREE);
const camera = new Camera(THREE, 60, config.aspectRatio, 0.1, 100);
const model = new Model(THREE, config);

config.addObserver(model);

const shape = model.native;

scene.add(shape);
scene.add(lighting.ambient(0xffffff, 2));
scene.add(lighting.directional(0xc60000, 2, { x: 0, y: 8, z: 0 }));
scene.add(lighting.directional(0x00c600, 2, { x: -8, y: 8, z: 7 }));

const clock = new THREE.Clock();

function animate(timestamp) {    
    const dt = clock.getDelta(); 
    const elapsedTime = clock.getElapsedTime();
    shape.rotation.x += 0.002;
    shape.rotation.y += 0.005;
    shape.rotation.z += 0.001;

    renderer.render(scene, camera.native);

    DeltaReport.log(timestamp);
    requestAnimationFrame(animate);
}

animate(performance.now());