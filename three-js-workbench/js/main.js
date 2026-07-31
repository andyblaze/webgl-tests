import * as THREE from "./three.module.js";
import DeltaReport from "./delta-report.js";
import Config from "./config.js";
import UiControls from "./ui-controls.js";
import Renderer from "./renderer.js";
import Camera from "./camera.js";
import Model from "./model.js";
import Lighting from "./lighting.js";

const config = new Config("workspace");

const uiControls = new UiControls("#material input")
uiControls.addObserver(config);
uiControls.notify();

const renderer = new Renderer(THREE, config);
const scene = new THREE.Scene();
const lighting = new Lighting();
const camera = new Camera(THREE, 60, config.aspectRatio, 0.1, 100);
const model = new Model(THREE, config);

config.addObserver(model);

/*const ctrl = byId("directionals0");
ctrl.oninput = () => {
    lighting.setColor("directionals0", ctrl.value);
};*/

scene.add(model.native);
scene.add(lighting.ambient(THREE, 0xffffff, 2));
scene.add(lighting.directional(THREE, 0xc60000, 12));
scene.add(lighting.directional(THREE, 0x00c600, 2));
lighting.setPosition("directionals0", 0, 8, 0);
lighting.setPosition("directionals1", -8, 8, 7);

const clock = new THREE.Clock();
const cube = model.native;

function animate(timestamp) {    
    const dt = clock.getDelta(); 
    const elapsedTime = clock.getElapsedTime();
    cube.rotation.x += 0.0017;
    cube.rotation.y += 0.0011;
    cube.rotation.z += 0.008;

    renderer.render(scene, camera.native);

    DeltaReport.log(timestamp);
    requestAnimationFrame(animate);
}

animate(performance.now());