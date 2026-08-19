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
    { inner: 1, outer: 5, spokes: 5, teeth: 48, direction: 1, speed: 0.003 },
    config
);
gear1.setPosition(5, 0, 0);

const gear2 = new GearWheel(
    THREE,
    { inner: 1, outer: 5, spokes: 5, teeth: 48, direction: 0, speed: 0 },
    config
);
gear2.setPosition(-5.4, 0, 0);
gear2.setRotation(0, degToRad(4), 0);

const clock = new Clock(THREE);
clock.addItem(gear1);
clock.addItem(gear2);
scene.add(clock.items);

function animate(timestamp) {    
    clock.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}
requestAnimationFrame(animate);

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});