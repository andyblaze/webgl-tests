import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Terrain from './terrain.js';
import DeformerFactory from './deformer.js';
import Materials from './materials.js';

// SCENE
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x18212b);


// CAMERA
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(30, 25, 35);

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
const ambient = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambient);

const sunlight = new THREE.DirectionalLight(0xffffff, 2.0);
sunlight.position.set(15, 30, 10);
sunlight.castShadow = true;
scene.add(sunlight);

const materials = new Materials(THREE);
const land = new Terrain(THREE, 40, 256);
const deformer = new DeformerFactory();

const hills = deformer.create("hills");
const mountain = deformer.create("mountain");
const noise = deformer.create("noise");

land.setMaterial(materials.getMat("green"))
    .terraform(hills)
    .terraform(mountain)
    .terraform(noise)
    .addTo(scene);

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();


// WINDOW RESIZE
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);

});
