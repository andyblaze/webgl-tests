import * as THREE from "three";

import Config from "./config.js";
import { makeCamera, makeRenderer } from "./functions.js";
import Box from "./box.js";
import { LightFactory, LightRegistry } from "./light-factory.js";
import Light from "./light.js";

const config = new Config(THREE, window);
const scene = new THREE.Scene();
const camera = makeCamera(THREE, config);
const renderer = makeRenderer(THREE, config);

const factory = new LightFactory(new LightRegistry(THREE));

const light1 = new Light(factory, "point", { color: 0x00ff00, intensity: 20 });
light1.setPosition(5, 5, 5);
light1.addTo(scene);

const light2 = new Light(factory, "point", { color: 0xff0000, intensity: 20 });
light2.setPosition(-5, -5, 5);
light2.addTo(scene);

const box = new Box(THREE, { size: 3, color: 0xffffff });
box.addTo(scene);

const timer = new THREE.Clock();

function animate() {
    const dt = timer.getDelta();
    const elapsed = timer.getElapsedTime(); 
    box.update(dt, elapsed);
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