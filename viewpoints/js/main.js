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
scene.background = new THREE.Color(0xc5c5c5);
scene.fog = new THREE.Fog(0xa0a5a0, 6, 100);

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

const floor = new THREE.Mesh(

    new THREE.PlaneGeometry(16, 16),

    new THREE.MeshStandardMaterial({
        color: 0x550000,
        roughness: 0.95,
        metalness: 0.05
    })

);

floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;

scene.add(floor);

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
    new THREE.TorusGeometry(0.35, 0.1),
    new THREE.MeshStandardMaterial({
        color:"orange",
        emissive:"orange",
        emissiveIntensity:0.3
    })
);

scene.add(sphere);

const clock = new THREE.Clock();
const monitorCam = monitor.camera;

function animate() {
    const t = clock.getElapsedTime();

    torus.rotation.x = t * 0.5;
    torus.rotation.y = t * 0.2;
    torus.rotation.z = t * 0.1;

    sphere.position.set(Math.cos(t) * 3, 1.5 + Math.sin(t * 2) * 0.5, Math.sin(t) * 3);
    sphere.rotation.x = t * 0.73;
    sphere.rotation.y = t * 0.91;
    //sphere.rotation.z = t * 0.17;

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