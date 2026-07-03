import * as THREE from "three";
import Lamp from "./lamp.js";
import Monitor from "./monitor.js";
import Camera from "./camera.js";
import Surface from "./surface.js";


function smoothstep(edge0, edge1, x) {
    const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
    return t * t * (3 - 2 * t);
}


function makeCamera() {
    const cam = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.1,
        100
    );
    cam.position.z = 12;
    return cam;
}

function makeRenderer() {
    const rdr = new THREE.WebGLRenderer({
        antialias:true
    });
    rdr.setSize(window.innerWidth, window.innerHeight);
    return rdr;
}

function makeLights(scene) {
    scene.add(new THREE.AmbientLight(0xffffff, 1.0));
    const light = new THREE.DirectionalLight(0xffffff, 2);
    light.position.set(5, 10, 10);
    scene.add(light);
}



const scene = new THREE.Scene();

const camera = makeCamera();
const renderer = makeRenderer(); 
document.body.appendChild(renderer.domElement);

makeLights(scene);


const lamps = [];
for ( let y = 6; y > -8; y -= 6 ) {
    for ( let x = -18; x < 7; x +=3  ) {
        //console.log(x,y);
        const lamp = new Lamp(THREE);
        lamp.setPosition(x, y, -12);
        scene.add(lamp.actual);
        lamps.push(lamp);
    }
}

const canvas = document.createElement("canvas");
canvas.width = 1024;
canvas.height = 256;

const ctx = canvas.getContext("2d");

const texture = new THREE.CanvasTexture(canvas);

const debugMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(7, 3),
    new THREE.MeshBasicMaterial({ map: texture })
);

debugMesh.position.set(7.5, -1, -1);
scene.add(debugMesh);

function drawSignal(value) {

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "lime";
    ctx.font = "148px monospace";
    ctx.fillText(value, 20, 80);

    texture.needsUpdate = true;
}

const clock = new THREE.Clock();

const renderTarget = new THREE.WebGLRenderTarget(512,512);
const monitor = new Monitor(
    new Camera(THREE, { fov: 60, aspect: 0.8, near: 0.1, far: 50 }),
    new Surface(THREE, { rt: renderTarget, radius: 2, widthSegs: 64, heightSegs: 64 })
);
monitor.setCameraPos(0, 0, 30).lookAt(0, 1, 0);
monitor.setSurfacePos(7, 3, 0);//.scaleSurface(2.2, 2.2, 2.2);
monitor.addToScene(scene);
const monitorCam = monitor.camera;

const width = 512;
const height = 512;

const buffer = new Uint8Array(width * height * 4);


function animate() {    
    const dt = clock.getDelta();
    const elapsed = clock.getElapsedTime();
    
    for ( const lamp of lamps )
        lamp.update(dt);

    monitor.toggleVisibility();

    renderer.setRenderTarget(renderTarget);
    renderer.render(scene, monitorCam);
    renderer.setRenderTarget(null);

    monitor.toggleVisibility();
    renderer.render(scene, camera);
renderer.readRenderTargetPixels(
    renderTarget,
    0,
    0,
    width,
    height,
    buffer
);

let hash = 2166136261; // FNV-ish seed

for (let i = 0; i < buffer.length; i += 16) { // skip for speed
    hash ^= buffer[i];
    hash = Math.imul(hash, 16777619);
}

drawSignal(hash >>> 0);
    requestAnimationFrame(animate);
}

animate();

window.addEventListener("resize",()=>{
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
