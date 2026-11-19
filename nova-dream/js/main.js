import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// ==========================================
// SUPERNOVA DREAM ENGINE
// Main application
// ==========================================

// Canvas
const canvas = document.querySelector('#universe');

// ==========================================
// RENDERER
// ==========================================

const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false,
    powerPreference: 'high-performance'
});

renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 2)
);

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

// Colour management
renderer.outputColorSpace = THREE.SRGBColorSpace;

renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;

// Black background
renderer.setClearColor(0x000000, 1);

// ==========================================
// SCENE
// ==========================================

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x000000);

// ==========================================
// CAMERA
// ==========================================

const camera = new THREE.PerspectiveCamera(
    55,                                     // FOV
    window.innerWidth / window.innerHeight,
    0.1,                                    // Near clipping
    1000                                    // Far clipping
);

camera.position.set(0, 0, 12);

camera.lookAt(0, 0, 0);

// ==========================================
// CLOCK
// ==========================================

const clock = new THREE.Timer();
const time = { "dt": 0, "elapsed": 0, "timestamp": 0 };


// ==========================================
// ANIMATION LOOP
// ==========================================

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

animate();

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

    renderer.setPixelRatio(
        Math.min(window.devicePixelRatio, 2)
    );
}

window.addEventListener('resize', onResize);
