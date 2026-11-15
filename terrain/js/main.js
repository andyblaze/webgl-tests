import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Terrain from './terrain.js';
import DeformerFactory from './deformer.js';
import Materials from './materials.js?g';
import { C } from './angles.js';

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


// CONTROLS
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// LIGHTING
const ambient = new THREE.AmbientLight(0xffffff, 4);
scene.add(ambient);

const sunr = new THREE.DirectionalLight(0xff0000, 3);
sunr.position.set(-12, 6, 0);
sunr.target.position.set(0, -5, 0);
sunr.castShadow = false;//true;
scene.add(sunr);
scene.add(sunr.target);

const sung = new THREE.DirectionalLight(0x00ff00, 3);
sung.position.set(12, 6, 0);
sung.target.position.set(0, -5, 0);
sung.castShadow = false;//true;
scene.add(sung);
scene.add(sung.target);

const sunb = new THREE.DirectionalLight(0x0000ff, 3);
sunb.position.set(0, 6, -12);
sunb.target.position.set(0, -5, 0);
sunb.castShadow = false;//true;
scene.add(sunb);
scene.add(sunb.target);
/*const helper = new THREE.CameraHelper(sun.shadow.camera);
scene.add(helper);*/

const materials = new Materials(THREE);
const land = new Terrain(THREE, 50, 128);
const deformer = new DeformerFactory();

const hills = deformer.create("hills", { maxRadius: 4, falloffRate: 0.02 });
const mountain = deformer.create("mountain", { maxRadius: 23, maxHeight: 12 });
const noise = deformer.create("noise", {
    detailSize: 0.5,
    amplitude: 2,
    octaves: 4,
    persistence: 0.5
});
const smooth = deformer.create("smoothing", { iterations: 3, strength: 0.65 });

const heightmap = deformer.create("heightmap", { maxHeight: 12});

await heightmap.load("./hm1.png");

land.setRotation(C.DEG90, 0, 0)
    .setMaterial(materials.getMat("brown"))
    .setPosition(0, -11, 0)
    .terraform(heightmap)    
    //.terraform(mountain)
    .terraform(noise)
    //.terraform(hills)
    //.terraform(smooth)
    .setShadows(true, true)
    .addTo(scene);

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    land.rotate(0.001);
    renderer.render(scene, camera);
}
animate();


// WINDOW RESIZE
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);

});
