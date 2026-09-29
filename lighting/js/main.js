import * as THREE from "three";

import Config from "./config.js";
import { makeCamera, makeRenderer } from "./functions.js";
import Lighting from "./lighting/lighting.js";
import MaterialsData from "./materials-data.js";
import Materials from "./materials.js";
import Rippling from "./effects/deformation.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

import { LightDimmer, Orbiter, ColorCycler, Rotater, Squasher } from "./effects/effects.js";
import { ShapeFactory } from "./shape-factory.js";
import Bend from "./curves/bend.js";
import CurveRegistry from "./curves/curve-registry.js";
import { deg2rad } from "./functions.js";
import World from "./world.js";

const config = new Config(THREE, window);
const scene = new THREE.Scene();
const camera = makeCamera(THREE, config);
const renderer = makeRenderer(THREE, config);
const lighting = new Lighting(THREE);
const materials = new Materials(THREE, new MaterialsData(THREE));
const factory = new ShapeFactory(THREE);
const world = new World(scene);

lighting.add(scene, "point", { color: 0x00ffff, intensity: 60 }).
    setPosition(-5, -3, 0).
addEffects([new LightDimmer(0.9, 0.02), new ColorCycler(THREE, 0.01)]);

lighting.add(scene, "spot", { color: 0x0000ff, intensity: 80, angle: deg2rad(35), distance: 15 }).
    setPosition(0, 9, 5).setTarget(-3, 0, 0).
    setShadows(true).setShadowMapSize(1024).
addEffects([new ColorCycler(THREE, 0.04)]);

lighting.add(scene, "spot", { color: 0x00ff00, intensity: 80, angle: deg2rad(35), distance: 15 }).
    setPosition(5, 5, 5).setTarget(0, 0, 0).
addEffects([new ColorCycler(THREE, 0.07)]);

lighting.add(scene, "spot", { color: 0x0000ff, intensity: 80, angle: deg2rad(35), distance: 15 }).
    setPosition(-5, 5, 5).setTarget(0, 0, 0).
addEffects([new ColorCycler(THREE, 0.011)]);

const egg = factory.create("sphere", materials.get("brushedMetal"));
egg.setShadows(true, true).setPosition(0, 0, 4).dimple();
egg.setScale(0.5, 1, 0.5).addEffects([new Orbiter(2, 0.23, "y"), new Rotater()]);

const torus = factory.create("torus", { radius: 0.75, tube: 0.25 }, materials.get("fireWorld"));
torus.setShadows(true, true).setScale(1, 1.25, 1).setPosition(3, 0, 3);
torus.addEffects([new Orbiter(2, 0.29, "z"), new Rotater(), new Squasher(0.17, 0.9)]);

const hedron = factory.create("dodecahedron", materials.get("iceWorld"));
hedron.setShadows(true, true).setPosition(-3, 0, 0);
hedron.addEffects([new Orbiter(3, 0.31, "x"), new Rotater(), new Squasher(0.13, 1.1)]);

const floor = factory.create("hidefPlane", materials.get("floor")); 
floor.setShadows(false, true).setRotation(deg2rad(80), 0, 0).
setPosition(0, -6, -8.5).addEffects([new Rippling()]);

const box = factory.create("flexiBox", materials.get("brushedBrass"));
box.setShadows(true, true).setPosition(1, -2, 2).pullSide(0.5, 0.5);
box.addEffects([new Rotater()]);

const cone = factory.create("sphere", materials.get("pinkMetal"));
cone.bendWith(new Bend(THREE, CurveRegistry.get("bend45", THREE)));
cone.setPosition(0, 0, -3).setScale(0.25, 0.25, 0.25).addEffects([new Orbiter(1, 0.23, "y"), new Rotater(), new Squasher(0.19, 1.1)]);

const wedge = factory.create("wedge", materials.get("greenWorld"));
wedge.setPosition(6, 0, -3).setScale(2, 2, 1).addEffects([new Rotater()]);

const mirror = factory.create(
    "mirror", 
    { width: 8, height: 6, texW: config.dprW, texH: config.dprH },
    { color: 0xffffff }
);
mirror.setPosition(-5.8, 0.25, 0).setRotation(0, deg2rad(55), 0);

world.addLighting(lighting).add([egg, torus, hedron, floor, box, cone, wedge, mirror]);

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