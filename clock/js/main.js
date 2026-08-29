import * as THREE from "three";
import { makeCamera, makeRenderer, degToRad } from "./functions.js";
import Config from "./config.js";
import Factory from "./factory.js";
import Clock from "./clock.js";
import GearTrain from "./geartrain.js";
import SpokedGear from "./spoked-gear.js";
import PinionGear from "./pinion-gear.js";
import HoledGear from "./holed-gear.js";
import Lights from "./lights.js";
import RpmReporter from "./rpm-reporter.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const config = new Config(THREE);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111);

const camera = makeCamera(THREE);
const renderer = makeRenderer(THREE);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const lights = new Lights(THREE);
lights.create(THREE, scene);

const factory = new Factory(THREE);

function addToScene(scene, item) {
    scene.add(item.native);
    return item;
}

const flywheelShaft = addToScene(scene, factory.shaft("flywheelShaft", config));
const shaft2 = addToScene(scene, factory.shaft("shaft2", config));
const shaft3 = addToScene(scene, factory.shaft("shaft3", config));
const shaft4 = addToScene(scene, factory.shaft("shaft4", config));

const flywheel = addToScene(scene, factory.bush("flywheel", config));
flywheelShaft.attach(flywheel, -1);

const secondHand = addToScene(scene, factory.hand("second", config));
shaft3.attach(secondHand, 1);

const flywheelCog = factory.gear("flywheelCog", config, new PinionGear());
const gear2 = factory.gear("gear2", config, new SpokedGear());
const gear3 = factory.gear("gear3", config, new SpokedGear());
const gear4 = factory.gear("gear4", config, new HoledGear());

flywheelShaft.attach(flywheelCog);
shaft2.attach(gear2);
shaft3.attach(gear3);
shaft4.attach(gear4);

const gearTrain = new GearTrain();
gearTrain.connect(flywheelCog, flywheel, -1);
gearTrain.connect(flywheelCog, gear2);
gearTrain.connect(gear2, gear3);
gearTrain.connect(gear3, gear4);
gearTrain.connect(gear3, secondHand, -1);
gearTrain.init();

const clock = new Clock(THREE, gearTrain, new RpmReporter());
clock.addItem(flywheelCog);
clock.addItem(gear2);
clock.addItem(gear3);
clock.addItem(gear4);
scene.add(clock.gears);

const timer = new THREE.Clock();

function animate(timestamp) {    
    const dt = timer.getDelta();
    const elapsed = timer.getElapsedTime();
    controls.update();
    lights.update(dt);
    clock.update(dt, elapsed);
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}
requestAnimationFrame(animate);

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});