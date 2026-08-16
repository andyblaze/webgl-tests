import * as THREE from 'three';
import MobiusStrip from "./mobius.js";
import { makeRenderer, makeLights } from './functions.js';

const config = {
    geometry: { radius: 1.25, width: 0.35, thickness: 0.06, segmentsU: 256, segmentsV: 64 },
    material: {
        vertexColors: true,
        side: THREE.DoubleSide,
        color: 0x40FFFF,
        roughness: 0.75,
        metalness: 0.5,
        emissive:0x1EDCDA,
        emissiveIntensity:0.5,
        clearcoat: 1,
        clearcoatRoughness: 0.5,
        anisotropy: 1
    },
    maps: {
        normalTex: "./textures/brush-normal.png",
        roughTex: "./textures/marble.png"
    }
};

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x031F29);

makeLights(THREE, scene);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 0, 4.5);

const renderer = makeRenderer(THREE, "container");

const mobius = new MobiusStrip(THREE, config);
scene.add(mobius.native);

const clock = new THREE.Clock();
function animate(timestamp) {    
    const dt = clock.getDelta();
    const elapsed = clock.getElapsedTime();
    mobius.update(dt, elapsed);
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
