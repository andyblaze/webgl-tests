import * as THREE from "three";

import Config from "./config.js";
import { makeCamera, makeRenderer } from "./functions.js";
import Lighting from "./lighting/lighting.js"
import Torus from "./shapes/torus.js";
//import Floor from "./shapes/floor.js";
import GravityWell from "./gravity-well.js";
import Mesh from "./mesh.js";
import Field from "./field.js";
import DeformingPlane from "./shapes/deforming-plane.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { LightDimmer, Orbiter, ColorCycler } from "./effects/effects.js";

const config = new Config(THREE, window);
const scene = new THREE.Scene();
const camera = makeCamera(THREE, config);
const renderer = makeRenderer(THREE, config);
const lighting = new Lighting(THREE);

lighting.add(scene, "point", { color: 0xff0000, intensity: 80 }).
    setPosition(0, 9, 2).
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
    addEffects([
        //new LightDimmer(0.5, 0.5), 
        new ColorCycler(THREE, 0.07)
    ]);

const box = new Torus(THREE, 1, 0.25, { color: 0xffffff });
box.addEffects([new Orbiter(3, 0.25, "z")]);
box.setShadows(true, true).setPosition(0, 0, 3);
box.addTo(scene);

const floor = new DeformingPlane(THREE, 24, 128, { color: 0xffffff, side: THREE.DoubleSide }); //Floor(THREE, 24, { color: 0xffffff, side: THREE.DoubleSide });
//floor.setRotation(0, Math.PI / 0.5, 0, 0).setPosition(0, -5, -1.5).
floor.setShadows(false, true).addTo(scene);

function makeWells(nWells) {
    const wells = [];
    for ( let i = 0; i < nWells; i++ )
        wells.push(new GravityWell());   
    return wells; 
}

const wells = makeWells(28);
const field = new Field(wells);

const positions = floor.geometry.attributes.position;
const mesh = new Mesh(positions);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const timer = new THREE.Clock();

function animate() {
    const dt = timer.getDelta();
    const elapsed = timer.getElapsedTime(); 
    lighting.update(dt, elapsed);
    field.update(elapsed);
    mesh.update(elapsed, field);
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