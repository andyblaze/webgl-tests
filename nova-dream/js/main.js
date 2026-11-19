import * as THREE from "three";
import { byId, makeCamera, makeRenderer, makeScene } from "./functions.js";
import { Core } from './Core.js';
import { ParticleEngine } from './ParticleEngine.js';
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const canvas = byId("universe");
const renderer = makeRenderer(THREE, canvas);
const scene = makeScene(THREE);
const camera = makeCamera(THREE);
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
const core = new Core(scene);
const particles = new ParticleEngine(scene, {
    count: 5000
});

const clock = new THREE.Timer();
const time = { "dt": 0, "elapsed": 0, "timestamp": 0 };

function animate(timestamp) {
    requestAnimationFrame(animate);

    clock.update();
    time.dt = Math.min(clock.getDelta(), 0.05);
    time.elapsed = clock.getElapsed();
    time.timestamp = timestamp;
    core.update(time.dt);
    particles.update(time.dt);
    controls.update();

    // Future systems will update here:
    // evolution.update(dt);
    // universe.update(elapsed, dt);
    // cameraController.update(dt);

    renderer.render(scene, camera);
}
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
