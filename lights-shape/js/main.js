import * as THREE from "three";
import { byId } from "./functions.js";
import Config from "./config.js";
import { makeCamera, makeLights, makeRenderer, makeShape } from "./makers.js";

const cfg = new Config(window);

const container = byId("three");
const renderer = makeRenderer(THREE, container);
const scene = new THREE.Scene();
const camera = makeCamera(THREE, cfg.innerW, cfg.innerH);
const shape = makeShape(THREE, "sphere");

// Dispose of the original material
if (Array.isArray(shape.material)) {
    shape.material.forEach(m => m.dispose());
} else {
    shape.material?.dispose();
}

// Load the normal map
const loader = new THREE.TextureLoader();
const roughnessMap = loader.load("maps/tile-frosty-glass.png");
roughnessMap.wrapS = THREE.RepeatWrapping;
roughnessMap.wrapT = THREE.RepeatWrapping;
roughnessMap.repeat.set(2, 2);
roughnessMap.offset.set(0, 1);
const normalMap = loader.load("maps/radial.png");

// Create your own material
const material = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    //transparent: true,
    //opacity: 0.8,
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
    normalScale: new THREE.Vector2(0.75, 0.75)
});

shape.material = material;

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

    //shape.material.roughness = 0.8 + Math.sin(t * 0.7);

    shape.rotation.x += 0.14 * time.dt;
    shape.rotation.y += 0.17 * time.dt;
    shape.rotation.z += 0.13 * time.dt;

    shape.material.emissive.setHSL((t * 0.13) % 1, 1, 0.5);

    shape.material.emissiveIntensity = 0.25 + ( Math.sin(t * 0.7) );

    

    lights.r.color.setHSL(((t / 2) + 0.33) % 1, 1, 0.5);
    lights.g.color.setHSL(((t / 3) + 0.22) % 1, 1, 0.5);
    lights.b.color.setHSL(((t / 5) + 0.11) % 1, 1, 0.5);

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
