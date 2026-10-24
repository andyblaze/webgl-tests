import * as THREE from "three";
import { byId, sineWave } from "./functions.js";
import Config from "./config.js";
import { makeCamera, makeLights, makeRenderer, makeShape } from "./makers.js";
import Presets from "../presets.js";

const cfg = new Config(window);

const presets = new Presets(THREE);

const container = byId("three");
const renderer = makeRenderer(THREE, container);
const scene = new THREE.Scene();
const camera = makeCamera(THREE, cfg.innerW, cfg.innerH);
const shape = makeShape(THREE, "dodecahedron", presets.p2);
shape.scale.set(1.25, 1, 1);
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

function animate(timestamp) {
    time.dt = timer.getDelta();
    time.elapsed = timer.getElapsedTime();
    time.timestamp = timestamp;

    t += time.dt * 0.125;

    //shape.material.roughness = sineWave(t * 4, 0.25, 1);

    shape.rotation.x += 0.07 * time.dt;
    shape.rotation.y += 0.09 * time.dt;
    shape.rotation.z += 0.03 * time.dt;

    //shape.material.emissive.setHSL((t * 0.13) % 1, 1, 0.5);

    const pulse = sineWave(t * 0.3, 0.125, 0.5);
    const shimmer = sineWave(t * 12.7, 0.57, 0.8);

    //shape.material.emissiveIntensity = pulse * shimmer;

    //shape.material.emissiveIntensity = sineWave(t * time.dt, 0.25, 0.5);

    lt = t * colourCycle.speed;

    for (const key of ["r", "g", "b"]) {
        const { period, phase } = colourCycle[key];
        lights[key].color.setHSL((lt / period + phase) % 1, 1, 0.5);
    }

    shape.material.roughnessMap.offset.x = sineWave(t * 0.8, 0, 2);
//shape.material.roughnessMap.offset.y = t * 0.3;
    

    /*lights.r.color.setHSL(((t / 19) + 0.61) % 1, 1, 0.5);
    lights.g.color.setHSL(((t / 37) + 0.23) % 1, 1, 0.5);
    lights.b.color.setHSL(((t / 59) + 0.103) % 1, 1, 0.5);*/

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
