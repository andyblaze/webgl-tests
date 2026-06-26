import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.166.1/build/three.module.js";
//import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.166.1/examples/jsm/controls/OrbitControls.js";

import Monolith from "./monolith.js";
import Glyphs from "./glyphs.js";

class Config {
    constructor() {
        this.NEON = [
            { h: 180, s: 100, l: 50, a: 1 }, // cyan
            { h: 140, s: 100, l: 50, a: 1 }, // green
            { h: 300, s: 100, l: 50, a: 1 }, // magenta
            { h: 270, s: 100, l: 60, a: 1 }, // violet
            { h: 210, s: 100, l: 55, a: 1 }  // electric blue
        ];
    }
}

const config = new Config();

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x081830);

const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.set(8, 6, 12);

const renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// ---------------------------------------------------------------------
// Lights
// ---------------------------------------------------------------------

const ambient = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambient);

const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
dirLight.position.set(10, 10, 10);
scene.add(dirLight);

// ---------------------------------------------------------------------
// Ground
// ---------------------------------------------------------------------

scene.fog = new THREE.FogExp2(0x0b1a2a, 0.02);
scene.background = new THREE.Color(0xa5a7ad);
const groundMat = new THREE.MeshStandardMaterial({
    color: 0x0a0f1a,
    roughness: 1,
    metalness: 0,
    transparent: true,
    opacity: 0.64
});

const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 100),
    groundMat
);

ground.rotation.x = -Math.PI / 2;
ground.position.y = 0;

scene.add(ground);

const monolith = new Monolith(THREE, { width: 4, height: 8, depth: 1, posX: 0, posY: 4, posZ: 0 });
monolith.build(THREE, new Glyphs("KAL EL"));
monolith.addToScene(scene);

// ---------------------------------------------------------------------
// Controls
// ---------------------------------------------------------------------

/*const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 4, 0);
controls.update();*/

// ---------------------------------------------------------------------
// Resize
// ---------------------------------------------------------------------

window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );
});

// ---------------------------------------------------------------------
// Render
// ---------------------------------------------------------------------
const clock = new THREE.Clock();
function animate(timestamp) {
    const dt = clock.getDelta();

    requestAnimationFrame(animate);

    monolith.update(dt, config);
    renderer.render(scene, camera);

}

animate(performance.now());