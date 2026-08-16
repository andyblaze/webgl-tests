import * as THREE from 'three';
import MobiusStrip from "./mobius.js";
import { makeRenderer, makeLights } from './functions.js';
import Config from './config.js';

const config = new Config(THREE);

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
