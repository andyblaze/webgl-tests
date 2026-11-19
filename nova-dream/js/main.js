import * as THREE from "three";
import { byId, makeCamera, makeRenderer } from "./functions.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const canvas = byId("universe");
const renderer = makeRenderer(THREE, canvas);
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);
const camera = makeCamera(THREE);

const clock = new THREE.Timer();
const time = { "dt": 0, "elapsed": 0, "timestamp": 0 };

function animate(timestamp) {
    requestAnimationFrame(animate);

    time.dt = Math.min(clock.getDelta(), 0.05);
    time.elapsed = clock.getElapsed();
    time.timestamp = timestamp;

    // Future systems will update here:
    // evolution.update(dt);
    // universe.update(elapsed, dt);
    // cameraController.update(dt);

    renderer.render(scene, camera);
}

// ==========================================
// START
// ==========================================

requestAnimationFrame(animate);

console.log(
    '%c SUPERNOVA DREAM ENGINE ',
    'background: #09051B; color: #FF35CE; padding: 8px 16px; font-weight: bold;'
);

// ==========================================
// RESIZE HANDLING
// ==========================================

function onResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}
window.addEventListener('resize', onResize);
