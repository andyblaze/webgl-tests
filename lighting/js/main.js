import * as THREE from "three";

import Config from "./config.js";
import { makeCamera, makeRenderer } from "./functions.js";
import Lighting from "./lighting/lighting.js";
import Materials from "./materials.js";
import Deformation from "./effects/deformation.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { LightDimmer, Orbiter, ColorCycler, Rotater } from "./effects/effects.js";
import { ShapeFactory } from "./shape-factory.js";
import { deg2rad } from "./functions.js";
import World from "./world.js";
import ThreeGroup from "./three/three-group.js";

const config = new Config(THREE, window);
const scene = new THREE.Scene();
const camera = makeCamera(THREE, config);
const renderer = makeRenderer(THREE, config);
const lighting = new Lighting(THREE);
const materials = new Materials(THREE);
const factory = new ShapeFactory(THREE);
const world = new World(scene);

lighting.add(scene, "point", { color: 0xff0000, intensity: 80 }).
    setPosition(0, 5, 0).
    setShadows(true).
    setShadowMapSize(1024).
    addEffects([new LightDimmer(0.2, 0.1), new ColorCycler(THREE, 0.01)]);

lighting.add(scene, "point", { color: 0x00ff00, intensity: 80 }).
    setPosition(-10, -3, -5).
    addEffects([new LightDimmer(0.2, 0.2), new ColorCycler(THREE, 0.04)]);

lighting.add(scene, "point", { color: 0x0000ff, intensity: 80 }).
    setPosition(10, -3, -5).
    addEffects([new LightDimmer(0.5, 0.5), new ColorCycler(THREE, 0.07)]);

lighting.add(scene, "point", { color: 0x0000ff, intensity: 80 }).
    setPosition(-10, 3, -5).
    addEffects([new LightDimmer(0.5, 0.5), new ColorCycler(THREE, 0.11)]);

lighting.add(scene, "point", { color: 0x0000ff, intensity: 80 }).
    setPosition(10, 3, -5).
    addEffects([new LightDimmer(0.5, 0.5), new ColorCycler(THREE, 0.13)]);

const egg = factory.create("sphere", materials.get("iceWorld"));
egg.setShadows(true, true).setScale(1.25, 1, 1).setPosition(0, 0, 0);
egg.addEffects([new Orbiter(2, 0.23, "y"), new Rotater()]);

const torus = factory.create("torus", { radius: 0.75, tube: 0.25 }, materials.get("fireWorld"));
torus.setShadows(true, true).setScale(1, 1.25, 1).setPosition(0, 0, 3);
torus.addEffects([new Orbiter(3, 0.29, "z"), new Rotater()]);
const pot = factory.create("flowerpot", materials.get("greenWorld"));
pot.setShadows(true, true).setScale(0.5, 1, 1).setPosition(0, 0, 0);
pot.addEffects([new Orbiter(4, 0.31, "x"), new Rotater()]);

const floor = factory.create("hidefPlane", materials.get("floor")); 
floor.setShadows(false, true).setRotation(deg2rad(80), 0, 0).
setPosition(0, -6, -8.5).addEffects([new Deformation()]);

const grp = new ThreeGroup(THREE);
grp.setPosition(0, 0, 3);
grp.add(factory.create("box", materials.get("iceWorld"))).add(factory.create("cone", materials.get("fireWorld")));
grp.addEffects([new Rotater()]);

world.addLighting(lighting).add([egg, torus, pot, floor, grp]);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const timer = new THREE.Clock();
const time = { dt: 0,  elapsed: 0, timestamp: 0 };

function animate(timestamp) {
    time.dt = timer.getDelta();
    time.elapsed = timer.getElapsedTime();
    time.timestamp = timestamp;
    world.update(time);
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