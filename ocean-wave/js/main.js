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
    22,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.set(0, 160, 160);
camera.lookAt(0, 0, 0);

//
// Renderer
//
const renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

//
// Light
//
/*const light = new THREE.DirectionalLight(0xffffff, 2);
light.position.set(0, 100, 100);
scene.add(light);

const ambient = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambient);*/

//
// Ground Plane
//
const meshSize = 160;
const texture = new THREE.TextureLoader().load("oce.jpg?g=009py");
texture.minFilter = THREE.LinearMipmapLinearFilter;
texture.magFilter = THREE.LinearFilter;
texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(
        meshSize * 1.4,   // width
        meshSize * 1.4,   // height
        meshSize,   // width segments
        meshSize    // height segments
    ),
    new THREE.MeshBasicMaterial({
        map: texture
    })
    /*new THREE.MeshBasicMaterial({
        color: 0x13D9BB,
        wireframe: true
    })*/
);

//
// Make it horizontal
//
plane.rotation.x = -Math.PI / 2;

scene.add(plane);

// Create gravity wells
const nWells = 20;
const wells = [];
for ( let i = 0; i < nWells; i++ )
    wells.push(new GravityWell(10, 10, 0, 3, 40, 7000, 48));
    /*new GravityWell(10, 10, 0, 3, 40, 7000, 48),
    new GravityWell(20, 10, 0, 4, 30, 5000, 27),
    new GravityWell(30, 20, 0, 2, 30, 2500, 56),
    new GravityWell(40, 20, 0, 0.8, 30, 6500, 66),
    new GravityWell(30, 40, 0, 1, 30, 3500, 76),
    new GravityWell(30, 10, 0, 2, 30, 7500, 86),
    new GravityWell(60, 20, 0, 4, 30, 9500, 96),
    new GravityWell(30, 30, 0, 3, 30, 6500, 56),
    new GravityWell(40, 40, 0, 2, 20, 4500, 43)
];*/
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