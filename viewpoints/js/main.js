import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Monitor from "./monitor.js";
import Camera from "./camera.js";
import Surface from "./surface.js";

const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(innerWidth,innerHeight);
renderer.setPixelRatio(devicePixelRatio);
document.body.appendChild(renderer.domElement);

//-----------------------------------------------------
// Scene
//-----------------------------------------------------

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x202530);

const mainCamera = new THREE.PerspectiveCamera(
45,
innerWidth/innerHeight,
0.1,
100
);

mainCamera.position.set(8,5,10);

const controls = new OrbitControls(mainCamera,renderer.domElement);
controls.target.set(0,1,0);
controls.update();

//-----------------------------------------------------
// SECOND CAMERA
//-----------------------------------------------------

const renderTarget = new THREE.WebGLRenderTarget(512,512);
const monitor = new Monitor(
    new Camera(THREE, { fov: 45, aspect: 1, near: 0.1, far: 100 }),
    new Surface(THREE, { rt: renderTarget, radius: 2, widthSegs: 64, heightSegs: 64 })
);
monitor.setCameraPos(-8,7,-8).lookAt(0,1,0);
monitor.setSurfacePos(-22, 3, -2).scaleSurface(2.2, 2.2, 2.2);
monitor.addToScene(scene);

//-----------------------------------------------------
// Lighting
//-----------------------------------------------------

scene.add(new THREE.AmbientLight(0xffffff,1.0));

const light = new THREE.DirectionalLight(0xffffff,2);
light.position.set(5,8,3);
scene.add(light);

//-----------------------------------------------------
// Floor
//-----------------------------------------------------

const grid = new THREE.GridHelper(20,20);
scene.add(grid);

//-----------------------------------------------------
// Objects
//-----------------------------------------------------

const torus = new THREE.Mesh(
new THREE.TorusKnotGeometry(1,0.35,128,16),
new THREE.MeshStandardMaterial({
color:0x55ccff,
metalness:0.3,
roughness:0.2
})
);

torus.position.y=2;
scene.add(torus);

const sphere = new THREE.Mesh(
new THREE.SphereGeometry(0.35),
new THREE.MeshStandardMaterial({
color:"orange",
emissive:"orange",
emissiveIntensity:0.3
})
);

scene.add(sphere);

//-----------------------------------------------------

window.addEventListener("resize",()=>{

mainCamera.aspect=innerWidth/innerHeight;
mainCamera.updateProjectionMatrix();

renderer.setSize(innerWidth,innerHeight);

});

//-----------------------------------------------------

const clock = new THREE.Clock();


//monitor.position.z += 0.05;
//frame.position.z += 0.04;

const monitorCam = monitor.camera;
function animate(){

requestAnimationFrame(animate);

const t = clock.getElapsedTime();

//animate scene

torus.rotation.x=t*0.5;
torus.rotation.y=t*0.2;
torus.rotation.z=t*0.1;

sphere.position.set(
Math.cos(t)*3,
1.5+Math.sin(t*2)*0.5,
Math.sin(t)*3
);

//==================================================
// FIRST
// Render scene into texture
//==================================================

//renderer.setRenderTarget(renderTarget);
//renderer.render(scene,monitorCamera);

//==================================================
// SECOND
// Render normal scene
//==================================================

monitor.toggleVisibility();
//frame.visible = false;

renderer.setRenderTarget(renderTarget);
renderer.render(scene, monitorCam);

renderer.setRenderTarget(null);

monitor.toggleVisibility();
//frame.visible = true;

renderer.render(scene, mainCamera);

}

animate();