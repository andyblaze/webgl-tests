import * as THREE from "three";

import Config from "./config.js";
import { makeCamera, makeRenderer } from "./functions.js";

const config = new Config(THREE, window);

const scene = new THREE.Scene();

const camera = makeCamera(THREE, config);
const renderer = makeRenderer(THREE, config);

const timer = new THREE.Clock();

function animate() {
    const dt = timer.getDelta();
    const elapsed = timer.getElapsedTime(); 
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