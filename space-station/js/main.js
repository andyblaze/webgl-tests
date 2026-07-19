import * as THREE from "https://unpkg.com/three@0.179.1/build/three.module.js";
import Mind from "./mind.js";
import Ship from "./ship.js";
import Planet from "./planet.js";
import SkyDome from "./sky.js";
import StarsDecor from "./stars.js";
import Sun from "./sun.js";
import { degToRad } from "./functions.js";

const scene = new THREE.Scene();

const renderer = new THREE.WebGLRenderer({
    antialias:true
});

renderer.setSize(window.innerWidth,window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

document.body.appendChild(renderer.domElement);

// Lighting
scene.add(new THREE.HemisphereLight(0x99bbff, 0x222222, 1.2));

const sun1 = new THREE.DirectionalLight(0xffffff, 0.7);
sun1.position.set(-9, 4, -21);//5, 10, 4);
scene.add(sun1);
const sun2 = new THREE.DirectionalLight(0xffffff, 1.6);
sun2.position.set(-9, 4, 21);//5, 10, 4);
scene.add(sun2);

const sunVisual = new Sun(THREE);
sunVisual.addToScene(scene);

renderer.setClearColor(0x0b1022);

const sky = new SkyDome(THREE, new StarsDecor(THREE, 2000));
sky.addToScene(scene);

const geometry = new THREE.CylinderGeometry( 20, 20, 280, 32 );
const material = new THREE.MeshBasicMaterial({ 
    color: 0x2f5021,
    roughness: 0.5,
    metalness: 0.925,
    emissive: 1 
});
const cylinder = new THREE.Mesh( geometry, material );
cylinder.position.x = 180;
cylinder.position.y = 10;
cylinder.position.z = -400;
cylinder.rotation.x = degToRad(-22);
cylinder.rotation.z = degToRad(-22);
scene.add( cylinder );


const planet = new Planet(THREE);
planet.addToScene(scene);

const ship = new Ship(THREE, new Mind());
const cam = ship.camera;

const clock = new THREE.Clock();

function animate(timestamp) {    
    const dt = clock.getDelta(); 
    const elapsedTime = clock.getElapsedTime();

    sunVisual.update(dt);
    // Keep the grid centred on the camera
    planet.update(cam);
    //
    // Keep the sky centred on the camera
    //
    sky.copyPosition(cam.position);
    sky.update();

    ship.update(dt);

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