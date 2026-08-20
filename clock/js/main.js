import * as THREE from "three";
import { makeCamera, makeRenderer, makeLights, degToRad } from "./functions.js";
import GearWheel from "./gearwheel.js";
import Config from "./config.js";
import Clock from "./clock.js";

const config = new Config(THREE);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111);

const camera = makeCamera(THREE);
const renderer = makeRenderer(THREE);

makeLights(THREE, scene);

const gear1 = new GearWheel(
    THREE,
    { inner: 1, spokes: 5, teeth: 48, direction: 1, speed: 0.08 },
    config
);
gear1.setPosition(7, 0, 0);

const gear2 = new GearWheel(
    THREE,
    { inner: 1, spokes: 3, teeth: 24, direction: 0, speed: 0 },
    config
);
gear2.setPosition(-0.85, 0, 0);
gear2.setRotation(0, degToRad(8), 0);

const gear3 = new GearWheel(
    THREE,
    { inner: 1, spokes: 4, teeth: 36, direction: 0, speed: 0 },
    config
);
gear3.setPosition(-7.45, 0, 0);
gear3.setRotation(0, degToRad(10), 0);

const clock = new Clock(THREE);
clock.addItem(gear1);
clock.addItem(gear2);
clock.addItem(gear3);
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