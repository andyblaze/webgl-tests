import * as THREE from "three";
import { makeCamera, makeRenderer, degToRad } from "./functions.js";
import GearWheel from "./gearwheel.js";
import Config from "./config.js";
import Clock from "./clock.js";
import GearShaft from "./gear-shaft.js";
import GearTrain from "./geartrain.js";
import SpokedGear from "./spoked-gear.js";
import PinionGear from "./pinion-gear.js";
import HoledGear from "./holed-gear.js";
import Bush from "./bush.js";
import Hand from "./hand.js";
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

function makeShaft(three, scene, name, cfg) {
    const s = new GearShaft(THREE, name, cfg);
    scene.add(s.native);
    return s;
}

const shaft1 = makeShaft(THREE, scene, "shaft1", config);
const shaft2 = makeShaft(THREE, scene, "shaft2", config);
const shaft3 = makeShaft(THREE, scene, "shaft3", config);
const shaft4 = makeShaft(THREE, scene, "shaft4", config);

const bush1 = new Bush(THREE, "bush1", config);
scene.add(bush1.native);
shaft1.attach(bush1, -1);

const secondHand = new Hand(THREE, "second", config);
scene.add(secondHand.native);
shaft3.attach(secondHand, 1);

const gear1 = new GearWheel(THREE, "gear1", config, new PinionGear());
const gear2 = new GearWheel(THREE, "gear2", config, new SpokedGear());
const gear3 = new GearWheel(THREE, "gear3", config, new SpokedGear());
const gear4 = new GearWheel(THREE, "gear4", config, new HoledGear());

shaft1.attach(gear1);
shaft2.attach(gear2);
shaft3.attach(gear3);
shaft4.attach(gear4);

const gearTrain = new GearTrain();
gearTrain.connect(gear1, bush1, -1);
gearTrain.connect(gear1, gear2);
gearTrain.connect(gear2, gear3);
gearTrain.connect(gear3, gear4);
gearTrain.connect(gear3, secondHand, -1);
gearTrain.init();

const clock = new Clock(THREE, gearTrain, new RpmReporter());
clock.addItem(gear1);
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