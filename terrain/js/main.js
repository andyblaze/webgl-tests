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
const ambient = new THREE.AmbientLight(0xffffff, 1.6);
scene.add(ambient);

const sunlight = new THREE.DirectionalLight(0xffffff, 2);
sunlight.position.set(15, 8, 0);
sunlight.castShadow = true;
scene.add(sunlight);

const materials = new Materials(THREE);
const land = new Terrain(THREE, 50, 128);
const deformer = new DeformerFactory();

const hills = deformer.create("hills", { maxRadius: 18, falloffRate: 2 });
const mountain = deformer.create("mountain", { maxRadius: 23, maxHeight: 12 });
const noise = deformer.create("noise", { scale: 0.16, amplitude: 3 });
const smooth = deformer.create("smoothing", { iterations: 3, strength: 0.65 });

const heightmap = deformer.create("heightmap", { terrainSize: 50, maxHeight: 12});

await heightmap.load("./hm2.png");

land.setRotation(1,0,0)//Math.PI / 2, Math.PI / 4.5, 0)
    .setMaterial(materials.getMat("green"))
    .terraform(heightmap)
    //.terraform(hills)
    //.terraform(mountain)
    .terraform(noise)
    //.terraform(smooth)
    .setShadows(true, true)
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
