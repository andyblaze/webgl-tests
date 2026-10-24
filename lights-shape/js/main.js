import * as THREE from "three";
import { byId, sineWave } from "./functions.js";
import Config from "./config.js";
import { makeCamera, makeLights, makeRenderer, makeShape } from "./makers.js";
import Presets from "../presets.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import SkyDome from "./sky.js";
import StarsDecor from "./stars.js";

const cfg = new Config(window);


const presets = new Presets(THREE);

const container = byId("three");
const renderer = makeRenderer(THREE, container);
const scene = new THREE.Scene();
const camera = makeCamera(THREE, cfg.innerW, cfg.innerH);
const shape = makeShape(THREE, "sphere", presets.p2);

function dimpleThis(shape) {

    const geometry = shape.geometry;
    const pos = geometry.attributes.position;

    // Dimple location on the original sphere
    const center = new THREE.Vector3(0, 0, 1.5);

    const radius = 4;  // Width of dimple
    const depth = 1.5;  // How deep it goes

    for (let i = 0; i < pos.count; i++) {
    const v = new THREE.Vector3().fromBufferAttribute(pos, i);

    const d = v.distanceTo(center);

    if (d < radius) {
        const falloff = 1 - d / radius;
        const displacement = depth * falloff * falloff;

        v.addScaledVector(v.clone().normalize(), -displacement);

        pos.setXYZ(i, v.x, v.y, v.z);
    }
    }

    pos.needsUpdate = true;
    geometry.computeVertexNormals();
}
dimpleThis(shape);
shape.scale.set(1.25, 0.75, 0.5);
scene.add(shape);

const lights = makeLights(THREE, scene);

const timer = new THREE.Clock();
const time = {dt: 0, elapsed: 0, timestamp: 0 };
let t = 0;
let lt = 0;

const colourCycle = {
    speed: 4,  // Overall animation speed
    r: { period: 19, phase: 0.11 },
    g: { period: 67, phase: 0.53 },
    b: { period: 89, phase: 0.97 }
};

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;


const sky = new SkyDome(THREE, new StarsDecor(THREE, 2000));
sky.addToScene(scene);

function animate(timestamp) {
    time.dt = timer.getDelta();
    time.elapsed = timer.getElapsedTime();
    time.timestamp = timestamp;

    t += time.dt * 0.125;

    shape.rotation.x += 0.07 * time.dt;
    shape.rotation.y += 0.09 * time.dt;
    shape.rotation.z += 0.03 * time.dt;

    shape.material.emissive.setHSL((t * 0.13) % 1, 1, 0.25);

    const pulse = sineWave(t * 0.3, 0.125, 0.5);
    const shimmer = sineWave(t * 12.7, 0.57, 0.8);

    shape.material.emissiveIntensity = pulse * shimmer;

    lt = t * colourCycle.speed;

    for (const key of ["r", "g", "b"]) {
        const { period, phase } = colourCycle[key];
        lights[key].color.setHSL((lt / period + phase) % 1, 1, 0.5);
    }

    shape.material.roughnessMap.offset.x = sineWave(t * 0.8, 0, 2);

    sky.update();

    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
