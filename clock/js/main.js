import * as THREE from "three";
import { makeCamera, makeRenderer, makeLights } from "./functions.js";
import GearWheel from "./gearwheel.js";
import Config from "./config.js";

const config = new Config(THREE);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111);

const camera = makeCamera(THREE);
const renderer = makeRenderer(THREE);

makeLights(THREE, scene);

const gearObj = new GearWheel(
    THREE,
    { inner: 1, outer: 5, spokes: 5, teeth: 48 },
    config
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