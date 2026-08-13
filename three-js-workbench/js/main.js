import * as THREE from "./three.module.js";
import DeltaReport from "./delta-report.js";
import Config from "./config.js";
import UiControls from "./ui-controls.js";
import Renderer from "./renderer.js";
import Camera from "./camera.js";
import Model from "./model.js";
import Lighting from "./lighting.js";
import Accordion from "./accordion.js"; 
import Associations from "./associations.js";
import { byQsArray } from "./functions.js";
import Registry from "./registry.js";
import Factory from "./factory.js";
import TextureLoader from "./texture-loader.js";

Registry.init(THREE);
Factory.init(Registry);

const config = new Config("workspace");

const uiControls = new UiControls();
const renderer = new Renderer(THREE, config);
const scene = new THREE.Scene();
const lighting = new Lighting(THREE);
const camera = new Camera(THREE, 60, config.aspectRatio, 0.1, 100);
const model = new Model(new TextureLoader(THREE), Factory, config);

const associations = new Associations(Registry);

for ( const light of lightsCfg )
    lighting.addLight(scene, light);

config.addObserver("material", model);
config.addObserver("maps", model);
config.addObserver("geometries", model);
config.addObserver("lights", lighting);

const ctrls = byQsArray("#ui-panel input");

uiControls.connect(ctrls).toObserver(config);

for ( const ctrl of ctrls ) {
    ctrl.oninput = () => {
        associations.update(ctrl);
        uiControls.synch(ctrl);
    };    
    // synch ctrl on page load
    associations.update(ctrl);
    uiControls.synch(ctrl);
}

const accordion = new Accordion("#accordion");

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