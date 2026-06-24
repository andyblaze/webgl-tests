import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.166.1/build/three.module.js";
//import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.166.1/examples/jsm/controls/OrbitControls.js";

import Monolith from "./monolith.js";
import Glyphs from "./glyphs.js";

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

const groundMat = new THREE.MeshStandardMaterial({
    color: 0x330000
});

const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 100),
    groundMat
);

ground.rotation.x = -Math.PI / 2;
ground.position.y = 0;

scene.add(ground);

const monolith = new Monolith(THREE, { width: 4, height: 8, depth: 1, posX: 0, posY: 4, posZ: 0 });
monolith.addGlyphs(new Glyphs("KAL EL"));
monolith.addToScene(scene);
monolith.render(THREE, scene);

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

    monolith.update(dt);
    renderer.render(scene, camera);

}

animate(performance.now());