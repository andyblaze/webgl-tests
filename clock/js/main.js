import * as THREE from "three";
import { makeCamera, makeRenderer, makeLights } from "./functions.js";
import GearWheel from "./gearwheel.js";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111);

const camera = makeCamera(THREE);
const renderer = makeRenderer(THREE);

makeLights(THREE, scene);

const gearObj = new GearWheel(
    THREE,
    1,      // inner radius
    5,      // outer radius
    5,      // spoke count
    48      // tooth count
);

const gear = gearObj.native;

scene.add(gear);

function animate(timestamp) {    
    gearObj.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}
requestAnimationFrame(animate);

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});