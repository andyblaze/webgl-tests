import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Monitor from "./monitor.js";
import Camera from "./camera.js";
import Surface from "./surface.js";
import { Knot, Torus, Floor } from "./shapes.js";
import Materials from "./materials.js";

const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(innerWidth,innerHeight);
renderer.setPixelRatio(devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // optional, but nicer
document.body.appendChild(renderer.domElement);

//-----------------------------------------------------
// Scene
//-----------------------------------------------------

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xc5c5c5);
//scene.fog = new THREE.FogExp2(0xa0a5a0, 0.02);

const mainCamera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 100);

mainCamera.position.set(8,5,10);

const controls = new OrbitControls(mainCamera,renderer.domElement);
controls.target.set(0,1,0);
controls.update();

//-----------------------------------------------------
// SECOND CAMERA
//-----------------------------------------------------

const renderTarget = new THREE.WebGLRenderTarget(512,512);
const monitor = new Monitor(
    new Camera(THREE, { fov: 50, aspect: 1, near: 0.1, far: 100 }),
    new Surface(THREE, { rt: renderTarget, radius: 2, widthSegs: 64, heightSegs: 64 })
);
monitor.setCameraPos(-8, 4, -8).lookAt(0, 1, 1.5);
monitor.setSurfacePos(-22, 3, -2).scaleSurface(2.2, 2.2, 2.2);
monitor.addToScene(scene);

//-----------------------------------------------------
// Lighting
//-----------------------------------------------------

scene.add(new THREE.AmbientLight(0xffffff,1.0));

const light = new THREE.DirectionalLight(0xffffff,2);
light.position.set(5,3,-3);
light.castShadow = true;
scene.add(light);

//-----------------------------------------------------
// Floor
//-----------------------------------------------------

const floor = new Floor(THREE);
scene.add(floor.shape);

//-----------------------------------------------------
// Objects
//-----------------------------------------------------


const knot = new Knot(THREE, Materials.brass(THREE));
scene.add(knot.shape);
const torus = new Torus(THREE, Materials.brass(THREE));
scene.add(torus.shape);

const clock = new THREE.Clock();
const monitorCam = monitor.camera;

function animate() {
    const t = clock.getElapsedTime();

    knot.update(t);
    torus.update(t);

    monitor.toggleVisibility();

    renderer.setRenderTarget(renderTarget);
    renderer.render(scene, monitorCam);
    renderer.setRenderTarget(null);

    monitor.toggleVisibility();

    renderer.render(scene, mainCamera);

    requestAnimationFrame(animate);
}

animate();

//-----------------------------------------------------

window.addEventListener("resize",()=>{
    mainCamera.aspect=innerWidth/innerHeight;
    mainCamera.updateProjectionMatrix();
    renderer.setSize(innerWidth,innerHeight);
});