import Config from "./config.js";
import Hand from "./hand.js";
import Clock from "./clock.js";
import { makeCamera, makeRenderer } from "./functions.js";

import * as THREE from "three";

const config = new Config(window);

const scene = new THREE.Scene();
const camera = makeCamera(THREE, config);
const renderer = makeRenderer(THREE, config);

const secondHand = new Hand(THREE, "secondHand", config);
scene.add(secondHand.native);
const minuteHand = new Hand(THREE, "minuteHand", config);
scene.add(minuteHand.native);
const hourHand = new Hand(THREE, "hourHand", config);
scene.add(hourHand.native);

const clock = new Clock();
clock.add(secondHand).add(minuteHand).add(hourHand);

const timer = new THREE.Clock();

function animate() {
    const dt = timer.getDelta();
    const elapsed = timer.getElapsedTime(); // might need later
    clock.update(dt, elapsed);
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

requestAnimationFrame(animate);

window.addEventListener("resize", () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const aspect = w / h;
    camera.left = -10 * aspect;
    camera.right = 10 * aspect;
    camera.top = 7.5;
    camera.bottom = -7.5;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
    config.aspect = aspect;
    config.innerW = w;
    config.innerH = h;
});