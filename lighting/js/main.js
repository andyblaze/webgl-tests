import * as THREE from "three";

import Config from "./config.js";
import { makeCamera, makeRenderer } from "./functions.js";
import Lighting from "./lighting.js";
import Box from "./box.js";
import TorusKnot from "./torusknot.js";
import Floor from "./floor.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { LightDimmer, Orbiter, ColorCycler } from "./effects.js";

const config = new Config(THREE, window);
const scene = new THREE.Scene();
const camera = makeCamera(THREE, config);
const renderer = makeRenderer(THREE, config);
const lighting = new Lighting(THREE);

lighting.add(scene, "point", { color: 0xff0000, intensity: 80 }).
    setPosition(0, 9, 0).
    setShadows(true).
    setShadowMapSize(1024).
    addEffects([
        new LightDimmer(0.2, 0.1),
        new ColorCycler(THREE, 0.01)
    ]);

lighting.add(scene, "point", { color: 0x00ff00, intensity: 80 }).
    setPosition(-10, 5, 5).
    addEffects([new LightDimmer(0.2, 0.2), new ColorCycler(THREE, 0.04)]);

lighting.add(scene, "point", { color: 0x0000ff, intensity: 80 }).
    setPosition(10, -5, -5).
    addEffects([new LightDimmer(0.5, 0.5), new ColorCycler(THREE, 0.07)]);

const torusknot = new TorusKnot(
    THREE, 
    1, 0.125,
    { color: 0xff0000, transparent: true, opacity: 0 }
);
torusknot.setShadows(true, true).setPosition(0, 8, 0);
torusknot.addTo(scene);

const box = new Box(THREE, 2, { color: 0xffffff });
box.addEffects([new Orbiter(4, 0.25)]);
box.setShadows(false, false).setPosition(0, 0, 0);
box.addTo(scene);

const plane = new Floor(THREE, 24, { color: 0xffffff, side: THREE.DoubleSide });
plane.setShadows(false, true);
plane.addTo(scene);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const timer = new THREE.Clock();

function animate() {
    const dt = timer.getDelta();
    const elapsed = timer.getElapsedTime(); 
    lighting.update(dt, elapsed);
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