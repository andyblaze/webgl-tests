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

const clock = new THREE.Clock();

const renderTarget = new THREE.WebGLRenderTarget(512,512);
const monitor = new Monitor(
    new Camera(THREE, { fov: 45, aspect: 0.8, near: 0.1, far: 50 }),
    new Surface(THREE, { rt: renderTarget, radius: 2, widthSegs: 64, heightSegs: 64 })
);
monitor.setCameraPos(10, 0, 20).lookAt(0, 1, 0);
monitor.setSurfacePos(7, 3, 0);//.scaleSurface(2.2, 2.2, 2.2);
monitor.addToScene(scene);
const monitorCam = monitor.camera;

class Output {
    constructor(three) {
        this.width = 512;
        this.height = 512;
        this.buffer = new Uint8Array(this.width * this.height * 4);
        this.elapsedDt = 0;
        this.canvas = document.createElement("canvas");
        this.canvas.width = 1024;
        this.canvas.height = 256;

        this.ctx = this.canvas.getContext("2d");

        this.texture = new three.CanvasTexture(this.canvas);

        this.debugMesh = new three.Mesh(
            new three.PlaneGeometry(7, 3),
            new three.MeshBasicMaterial({ map: this.texture })
        );
        this.debugMesh.position.set(7.5, -1, -1);
    }
    addToScene(scene) {
        scene.add(this.debugMesh);
    }

    drawSignal(value) {
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = "lime";
        this.ctx.font = "148px monospace";
        this.ctx.fillText(value, 20, 80);

        this.texture.needsUpdate = true;
    }
    update(dt, renderer, rt) {
        this.elapsedDt += dt;
        //console.log(this.elapsedDt < 1);
        if ( this.elapsedDt > 1 ) {
            renderer.readRenderTargetPixels(
                rt,
                0,
                0,
                this.width,
                this.height,
                this.buffer
            );

            let hash = 2166136261; // FNV-ish seed

            for ( let i = 0; i < this.buffer.length; i += 16 ) { // skip for speed
                hash ^= this.buffer[i];
                hash = Math.imul(hash, 16777619);
            }
            this.drawSignal(hash >>> 0);
            this.elapsedDt = 0;
        }
    }
}

const output = new Output(THREE);
output.addToScene(scene);

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
    
    output.update(dt, renderer, renderTarget);

    requestAnimationFrame(animate);
}

animate();

window.addEventListener("resize",()=>{
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
