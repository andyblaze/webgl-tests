import * as THREE from "three";

import Config from "./config.js";
import { makeCamera, makeRenderer } from "./functions.js";
import Lighting from "./lighting/lighting.js";
import Materials from "./materials.js";
import Box from "./shapes/box.js"
import DeformingPlane from "./shapes/deforming-plane.js";
import Deformation from "./effects/deformation.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { LightDimmer, Orbiter, ColorCycler } from "./effects/effects.js";

const config = new Config(THREE, window);
const scene = new THREE.Scene();
const camera = makeCamera(THREE, config);
const renderer = makeRenderer(THREE, config);
const lighting = new Lighting(THREE);
const materials = new Materials(THREE);

lighting.add(scene, "point", { color: 0xff0000, intensity: 80 }).
    setPosition(0, 5, 0).
    setShadows(true).
    setShadowMapSize(1024).
    addEffects([
        new LightDimmer(0.2, 0.1),
        new ColorCycler(THREE, 0.01)
    ]);

lighting.add(scene, "point", { color: 0x00ff00, intensity: 80 }).
    setPosition(-10, -3, -5).
    addEffects([
        new LightDimmer(0.2, 0.2), 
        new ColorCycler(THREE, 0.04)
    ]);

lighting.add(scene, "point", { color: 0x0000ff, intensity: 80 }).
    setPosition(10, -3, -5).
    addEffects([
        new LightDimmer(0.5, 0.5), 
        new ColorCycler(THREE, 0.07)
    ]);

const box = new Box(THREE, 2, materials.get("iceWorld"));
box.addEffects([new Orbiter(1.5, 0.25, "y")]);
box.setShadows(true, true).setScale(1, 1, 2).setPosition(0, 0, 3);
box.addTo(scene);

const floor = new DeformingPlane(THREE, 24, 128, materials.get("floor")); 
floor.setShadows(false, true).addTo(scene);

const deformation = new Deformation(floor);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const timer = new THREE.Clock();

function animate(timestamp) {
    const dt = timer.getDelta();
    const elapsed = timer.getElapsedTime(); 
    lighting.update(dt, elapsed);
    deformation.update(timestamp);
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