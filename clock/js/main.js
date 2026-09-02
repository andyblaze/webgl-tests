import * as THREE from "three";
import { makeCamera, makeRenderer } from "./functions.js";
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
import { ROT360, ROT180 } from "./consts.js";

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

function minuteAngle(date) {
    return (date.getMinutes() / 60) * ROT360;
}

const flywheelShaft = addToScene(scene, factory.shaft("flywheelShaft", config));
const minTrainShaft1 = addToScene(scene, factory.shaft("minTrainShaft1", config));
const minTrainShaft2 = addToScene(scene, factory.shaft("minTrainShaft2", config));
const minTrainShaft3 = addToScene(scene, factory.shaft("minTrainShaft3", config));
const minTrainShaft4 = addToScene(scene, factory.shaft("minTrainShaft4", config));
const minTrainShaft5 = addToScene(scene, factory.shaft("minTrainShaft5", config));

const flywheel = addToScene(scene, factory.bush("flywheel", config));
flywheelShaft.attach(flywheel, -1.25);

const flywheelCog = factory.gear("flywheelCog", config, new PinionGear());
const flywheelGear = factory.gear("flywheelGear", config, new HoledGear());
const minTrainGear1 = factory.gear("minTrainGear1", config, new SpokedGear());
const minTrainGear2 = factory.gear("minTrainGear2", config, new SpokedGear());
const minTrainGear3 = factory.gear("minTrainGear3", config, new HoledGear());
const minTrainGear4 = factory.gear("minTrainGear4", config, new SpokedGear());
const minTrainGear5 = factory.gear("minTrainGear5", config, new HoledGear());
const minTrainGear6 = factory.gear("minTrainGear6", config, new SpokedGear());
const minTrainGear7 = factory.gear("minTrainGear7", config, new SpokedGear());
const minTrainGear8 = factory.gear("minTrainGear8", config, new SpokedGear());
const minTrainGear9 = factory.gear("minTrainGear9", config, new SpokedGear());

flywheelShaft.attach(flywheelCog);
flywheelShaft.attach(flywheelGear, 1.15);
minTrainShaft1.attach(minTrainGear1);
minTrainShaft1.attach(minTrainGear2, 1.5);
minTrainShaft2.attach(minTrainGear3, 0.35);
minTrainShaft2.attach(minTrainGear4, 1.35);
minTrainShaft3.attach(minTrainGear5, 2.5);
minTrainShaft3.attach(minTrainGear6, 3.5);
minTrainShaft4.attach(minTrainGear7, 3.5);
minTrainShaft4.attach(minTrainGear8, 1.5);
minTrainShaft5.attach(minTrainGear9, 1.5);

const minuteHand = addToScene(scene, factory.hand("minute", config));
minTrainShaft5.attach(minuteHand, 1);

const now = new Date();
minuteHand.setRotation(0, minuteAngle(now), 0);


const gearTrain = new GearTrain();
//  .connect is (driver wheel, driven wheel, ratio override)
gearTrain.connect(flywheelCog, flywheel, -1);
gearTrain.connect(flywheel, flywheelGear, -1);
gearTrain.connect(flywheelCog, minTrainGear1);
gearTrain.connect(minTrainGear1, minTrainGear2, -1);
gearTrain.connect(minTrainGear2, minTrainGear3);
gearTrain.connect(minTrainGear3, minTrainGear4, -1);
gearTrain.connect(minTrainGear4, minTrainGear5);
gearTrain.connect(minTrainGear5, minTrainGear6, -1);
gearTrain.connect(minTrainGear6, minTrainGear7);
gearTrain.connect(minTrainGear7, minTrainGear8, -1);
gearTrain.connect(minTrainGear8, minTrainGear9);
gearTrain.connect(minTrainGear9, minuteHand, -1);
gearTrain.init();

const clock = new Clock(THREE, gearTrain, new RpmReporter());
clock.addItem(flywheelCog).addItem(flywheelGear);
clock.addItem(minTrainGear1).addItem(minTrainGear2);
clock.addItem(minTrainGear3).addItem(minTrainGear4);
clock.addItem(minTrainGear5).addItem(minTrainGear6);
clock.addItem(minTrainGear7).addItem(minTrainGear8);
clock.addItem(minTrainGear9);

scene.add(clock.visuals);

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