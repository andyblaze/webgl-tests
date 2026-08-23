import * as THREE from "three";
import { makeCamera, makeRenderer, makeLights, degToRad } from "./functions.js";
import GearWheel from "./gearwheel.js";
import Config from "./config.js";
import Clock from "./clock.js";
import GearShaft from "./gear-shaft.js";
import GearTrain from "./geartrain.js";

const config = new Config(THREE);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111);

const camera = makeCamera(THREE);
const renderer = makeRenderer(THREE);

makeLights(THREE, scene);

const shaft1 = new GearShaft(THREE, config);
shaft1.setPosition(7, 0, 0);
scene.add(shaft1.native);

const shaft2 = new GearShaft(THREE, config);
shaft2.setPosition(-0.6, 2, 0);
scene.add(shaft2.native);

const shaft3 = new GearShaft(THREE, config);
shaft3.setPosition(-5.75, -2.15, 0);
scene.add(shaft3.native);

const shaft4 = new GearShaft(THREE, config);
shaft4.setPosition(-10.7, -0.1, 0);
scene.add(shaft4.native);

const gear1 = new GearWheel(THREE, "gear1", config);
const gear2 = new GearWheel(THREE, "gear2", config);
const gear3 = new GearWheel(THREE, "gear3", config);
const gear4 = new GearWheel(THREE, "gear4", config);

const gearTrain = new GearTrain();
gearTrain.connect(gear1, gear2);
gearTrain.connect(gear2, gear3);
gearTrain.connect(gear3, gear4);
gearTrain.init();

const clock = new Clock(THREE, gearTrain);
clock.addItem(gear1);
clock.addItem(gear2);
clock.addItem(gear3);
clock.addItem(gear4);
scene.add(clock.gears);

const timer = new THREE.Clock();

function animate(timestamp) {    
    const dt = timer.getDelta();
    const elapsed = timer.getElapsedTime();
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