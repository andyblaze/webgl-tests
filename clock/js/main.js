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

function makeShaft(three, scene, cfg, pos) {
    const s = new GearShaft(THREE, cfg);
    const { x, y, z } = {...pos};
    s.setPosition(x, y, z);
    scene.add(s.native);
    return s;
}

const shaft1 = makeShaft(THREE, scene, config, { x: 7, y: 0, z: 0 });
const shaft2 = makeShaft(THREE, scene, config, { x: -0.6, y: 2, z: 0 });
const shaft3 = makeShaft(THREE, scene, config, { x: -5.75, y: -2.15, z: 0 });
const shaft4 = makeShaft(THREE, scene, config, { x: -10.7, y: -0.1, z: 0 });

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