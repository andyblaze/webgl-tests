import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Terrain from './terrain.js';
import DeformerFactory from './deformer.js';
import Materials from './materials.js?g';
import { C } from './angles.js';
import SphereNoise from '../deformers/spherenoise.js';

// SCENE
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);


// CAMERA
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 0, 50);

// RENDERER
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

function makeLight(three, col, x, y, z) {
    const lt = new three.DirectionalLight(col, 3);
    lt.position.set(x, y, z);
    lt.target.position.set(0, -5, 0);
    lt.castShadow = false;//true;
    return lt;
}



function colorCycle(light, h, speed = 0.0002, radius = 2) {

    let hue = h;
    let angle = 0;

    const origin = light.position.clone();

    return function update() {

        hue = (hue + speed) % 1;
        angle += speed * 30;

        light.color.setHSL(hue, 1, 0.5);

        light.position.x = origin.x + Math.cos(angle) * radius;
        light.position.z = origin.z + Math.sin(angle) * radius;

    };
}


// CONTROLS
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// LIGHTING
const ambient = new THREE.AmbientLight(0xffffff, 4);
scene.add(ambient);

const sunr = makeLight(THREE, 0xff0000, -12, 6, 0);
scene.add(sunr, sunr.target);

const sung = makeLight(THREE, 0x00ff00, 12, 6, 0);
scene.add(sung, sung.target);

const sunb = makeLight(THREE, 0x0000ff, 0, 6, -12);
scene.add(sunb, sunb.target);
/*const helper = new THREE.CameraHelper(sun.shadow.camera);
scene.add(helper);*/

const materials = new Materials(THREE);
const land = new Terrain(THREE, 50, 128);
const deformer = new DeformerFactory();

const hills = deformer.create("hills", { maxRadius: 8 });
const mountain = deformer.create("mountain", { maxRadius: 23, maxHeight: 12 });
const noise = deformer.create("noise", {
    detailSize: 0.5,
    amplitude: 2,
    octaves: 4,
    persistence: 0.5
});
const smooth = deformer.create("smoothing", { iterations: 3, strength: 0.65 });

const heightmap = deformer.create("heightmap", { maxHeight: 12});

await heightmap.load("./hm2.png");

land.setRotation(C.DEG90, 0, 0)
    .setMaterial(materials.getMat("brown"))
    .setPosition(0, -11, 0)
    .terraform(heightmap)    
    //.terraform(mountain)
    .terraform(hills)
    .terraform(noise)
    //.terraform(smooth)
    .setShadows(true, true)
    .addTo(scene);

const cycleR = colorCycle(sunr, 0, 0.00019, 5);
const cycleG = colorCycle(sung, 0.333, 0.00029, 7);
const cycleB = colorCycle(sunb, 0.583, 0.00031, 11);



const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(5, 128, 128),
    new THREE.MeshPhysicalMaterial(materials.getMat("brown"))
);

sphere.position.set(0, 6, 0);



const shills = new SphereNoise({
    detailSize: 2,
    amplitude: 1.5,
    octaves: 4,
    persistence: 0.5
});

shills.apply(sphere.geometry.attributes.position);

sphere.geometry.computeVertexNormals();
scene.add(sphere);

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    cycleR();
    cycleG();
    cycleB();
    land.rotate(0.001);
    sphere.rotateX(0.001);
    sphere.rotateY(0.002);
    sphere.rotateZ(0.003);
    renderer.render(scene, camera);
}
animate();


// WINDOW RESIZE
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);

});
