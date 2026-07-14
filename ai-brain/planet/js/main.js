import * as THREE from "https://unpkg.com/three@0.179.1/build/three.module.js";
import Ship from "./ship.js";
import Planet from "./planet.js";
import SkyDome from "./sky.js";
import StarsDecor from "../stars.js";

const scene = new THREE.Scene();

const renderer = new THREE.WebGLRenderer({
    antialias:true
});

renderer.setSize(window.innerWidth,window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

document.body.appendChild(renderer.domElement);

// Lighting
scene.add(new THREE.HemisphereLight(0x99bbff, 0x222222, 1.2));

const sun = new THREE.DirectionalLight(0xffffff, 0.7);
sun.position.set(5, 10, 4);
scene.add(sun);


/*scene.fog = new THREE.Fog(
    0x0b1022,
    150,
    1200
);*/

renderer.setClearColor(0x0b1022);

const sky = new SkyDome(THREE, new StarsDecor(THREE, 2000));
sky.addToScene(scene);

const planet = new Planet(THREE);
planet.addToScene(scene);

// Animation

const ship = new Ship(THREE);
const cam = ship.camera;
const clock = new THREE.Clock();

function animate(timestamp) {    
    const dt = clock.getDelta(); 
    const elapsedTime = clock.getElapsedTime();
    // Keep the grid centred on the camera
    planet.update(cam);
    //
    // Keep the sky centred on the camera
    //
    sky.copyPosition(cam.position);
    sky.update();

    renderer.render(scene, cam);
    requestAnimationFrame(animate);
}

animate(performance.now());

//
// Resize
//

window.addEventListener("resize",()=>{
    cam.aspect = window.innerWidth / window.innerHeight;
    cam.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);

});