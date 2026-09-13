import * as THREE from "three";

import Config from "./config.js";
import { makeCamera, makeRenderer } from "./functions.js";
import Box from "./box.js";
import TorusKnot from "./torusknot.js";
import Floor from "./floor.js";
import { LightFactory, LightRegistry } from "./light-factory.js";
import Light from "./light.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const config = new Config(THREE, window);
const scene = new THREE.Scene();
const camera = makeCamera(THREE, config);
const renderer = makeRenderer(THREE, config);

const factory = new LightFactory(new LightRegistry(THREE));

const light1 = new Light(factory, "point", { color: 0xff0000, intensity: 80 });
light1.setPosition(0, 18, 0).setShadows(true);
light1.setShadowMapSize(1024).setOrbit(3, 0.125).addTo(scene);

const light2 = new Light(factory, "point", { color: 0xffff00, intensity: 40 });
light2.setPosition(-5, 10, 0);
light2.setOrbit(5, 0.0125).addTo(scene);

const light3 = new Light(factory, "point", { color: 0x00ffff, intensity: 40 });
light3.setPosition(5, 10, 0);
light3.setOrbit(4, 0.0225).addTo(scene);

const torusknot = new TorusKnot(
    THREE, 
    1, 0.125,
    { color: 0xff0000, transparent: true, opacity: 0 }
);
torusknot.setShadows(true, true).setPosition(0, 8, 0);
torusknot.addTo(scene);

const box = new Box(THREE, 2, { color: 0xffffff });
box.setShadows(false, false).setPosition(0, 0, 0);
box.setOrbit(8, 0.25).addTo(scene);

const plane = new Floor(THREE, 24, { color: 0xffffff, side: THREE.DoubleSide });
plane.setShadows(false, true);
plane.addTo(scene);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const timer = new THREE.Clock();

function animate() {
    const dt = timer.getDelta();
    const elapsed = timer.getElapsedTime(); 
    torusknot.update(dt, elapsed);
    box.update(dt, elapsed);
    controls.update();
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