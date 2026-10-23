import * as THREE from "three";
import { byId, sineWave } from "./functions.js";
import Config from "./config.js";
import { makeCamera, makeLights, makeRenderer, makeShape } from "./makers.js";

const cfg = new Config(window);

class Presets {
    constructor(three) {
        this.three = three;
        this.loader = new three.TextureLoader();
        const roughnessMap = this.loader.load("maps/tile-frosty-glass.png");
        roughnessMap.wrapS = three.RepeatWrapping;
        roughnessMap.wrapT = three.RepeatWrapping;
        roughnessMap.repeat.set(2, 2);
        roughnessMap.offset.set(0, 1);
        const normalMap = this.loader.load("maps/radial.png");

        this.p1 = {
            color: 0xffffff,
            transparent: true,
            opacity: 0.8,
            metalness: 1,
            roughness: 0.9,
            transmission: 0.25,
            clearcoat: 1,
            clearcoatRoughness: 0.75,
            thickness: 0.8,
            ior: 1,
            emissiveIntensity: 0.5,
            emissive: 0x0080ff,
            anisotropy: 0.125,
            attenuationColor: 0x00ffff,
            roughnessMap,
            normalMap,
            normalScale: new three.Vector2(0.75, 0.75)
        };
    }
    material(key) {
        return this[key];
    }
}

const presets = new Presets(THREE);

const container = byId("three");
const renderer = makeRenderer(THREE, container);
const scene = new THREE.Scene();
const camera = makeCamera(THREE, cfg.innerW, cfg.innerH);
const shape = makeShape(THREE, "sphere", presets.p1);
shape.receiveShadow = true;
scene.add(shape);

const lights = makeLights(THREE, scene);

const timer = new THREE.Clock();
const time = {dt: 0, elapsed: 0, timestamp: 0 };
let t = 0;

function animate(timestamp) {
    time.dt = timer.getDelta();
    time.elapsed = timer.getElapsedTime();
    time.timestamp = timestamp;

    t += time.dt * 0.125;

    shape.material.roughness = sineWave(t * 4, 0.25, 1);

    shape.rotation.x += 0.14 * time.dt;
    shape.rotation.y += 0.17 * time.dt;
    shape.rotation.z += 0.13 * time.dt;

    shape.material.emissive.setHSL((t * 0.13) % 1, 1, 0.5);

    const pulse = sineWave(t * 0.3, 0.125, 0.5);
    const shimmer = sineWave(t * 12.7, 0.57, 0.8);

    shape.material.emissiveIntensity = pulse * shimmer;

    //shape.material.emissiveIntensity = sineWave(t * time.dt, 0.25, 0.5);

    

    lights.r.color.setHSL(((t / 2) + 0.31) % 1, 1, 0.5);
    lights.g.color.setHSL(((t / 3) + 0.23) % 1, 1, 0.5);
    lights.b.color.setHSL(((t / 5) + 0.13) % 1, 1, 0.5);

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
