import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.165.0/build/three.module.js";
import Field from "./field.js";
import Mesh from "./mesh.js";
import GravityWell from "./gravity-well.js";
import DeltaReport from "./delta-report.js";
//
// Scene
//
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

//
// Camera
//
const camera = new THREE.PerspectiveCamera(
    44,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.set(0, 11, 20);
camera.lookAt(0, 0, 0);

//
// Renderer
//
const renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//
// Light
//
const light = new THREE.DirectionalLight(0xffffff, 2);
light.position.set(10, 20, 10);
scene.add(light);

const ambient = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambient);

//
// Ground Plane
//
const meshSize = 140;
const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(
        meshSize,   // width
        meshSize,   // height
        meshSize,   // width segments
        meshSize    // height segments
    ),
    new THREE.MeshBasicMaterial({
        color: 0x00ff00,
        wireframe: true
    })
);

//
// Make it horizontal
//
plane.rotation.x = -Math.PI / 2;

scene.add(plane);

// Create gravity wells
const wells = [
    new GravityWell(0, 0, 0, 9, 40, 3000, 11),
    new GravityWell(20, 10, 0, 4, 30, 2000, 7),
    new GravityWell(30, 20, 0, 5, 30, 2500, 6),
    new GravityWell(40, 40, 0, 2, 20, 4500, 13)
];
const field = new Field(wells);

const positions = plane.geometry.attributes.position;
const mesh = new Mesh(positions);

// Render
function animate(timestamp) {
    field.update(timestamp);
    mesh.update(timestamp, field);
    renderer.render(scene, camera);
    DeltaReport.log(timestamp);
    requestAnimationFrame(animate);
}

animate(performance.now());


//
// Resize
//
window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});