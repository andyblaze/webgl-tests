import * as THREE from "three";

import Config from "./config.js";
import { makeCamera, makeRenderer } from "./functions.js";
import Lighting from "./lighting/lighting.js";
import MaterialsData from "./materials-data.js";
import Materials from "./materials.js";
import Rippling from "./effects/deformation.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

import { LightDimmer, Orbiter, ColorCycler, Rotater, Squasher, MapOffsetter } from "./effects/effects.js";
import { ShapeFactory } from "./shape-factory.js";
import Bend from "./curves/bend.js";
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

lighting.add(scene, "spot", { color: 0xffffff, intensity: 1, angle: deg2rad(35), distance: 15 }).
    setPosition(0, 9, 5).setTarget(-3, 0, 0).
    setShadows(true).setShadowMapSize(1024).
addEffects([new ColorCycler(THREE, 0.04)]);

const moon = factory.create("sphere", materials.get("moonWorld"));
    moon.setPosition(0, 5, -5);

const cloud = factory.create("plane", { width: 8, height: 8, wSegs: 32, hSegs: 32 }, materials.get("cloud"));
cloud.setPosition(0, 3, 0).
    setRotation(deg2rad(20), 0, 0).
    addEffects([new MapOffsetter()]);

const mirror = factory.create(
    "mirror", 
    { width: 48, height: 32, texW: config.dprW, texH: config.dprH },
    { color: 0xffffff }
);
mirror.setPosition(0, -4, 0).
    setRotation(deg2rad(290), deg2rad(0), 0);

world.addLighting(lighting).add([
    cloud,
    moon, 
    mirror
]);

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