import * as THREE from "three";
import { byId, byQsArray, mt_rand } from "./functions.js";
import UiControls from "./uicontrols.js";
import NormalMap from "./normal-map.js";
import Perlin from "./perlin.js";
import Canvas from "./canvas.js";
import HeightMap from "./height-map.js";
import { makeCamera, makeLights, makeRenderer, makeShape } from "./makers.js";

const heightCanvas = new Canvas("heightMap");
const heightMap = new HeightMap(heightCanvas, new Perlin(mt_rand(10000, 100000)));
heightMap.addObserver(heightCanvas);

const uiControls = new UiControls("#ui-ctrls input");
uiControls.addObserver(heightMap);
byId("ui-ctrls").reset();
uiControls.notify();

const normalCanvas = new Canvas("normalMap");
const normalMap = new NormalMap(heightMap.size, normalCanvas);
const container = byId("three");
const renderer = makeRenderer(THREE, container);
const scene = new THREE.Scene();
const camera = makeCamera(THREE, container.clientWidth, container.clientHeight);

makeLights(THREE, scene);

let shape = makeShape(THREE, byId("geometry-change").value);
scene.add(shape);

byId("geometry-change").onchange = (e) => {
    scene.remove(shape);
    shape.geometry.dispose();
    shape.material.dispose();
    shape = makeShape(THREE, e.target.value);
    scene.add(shape);
    applyNormal();
    applyToShape();
};


function applyNormal() {
    const strength = byId("strength");
    const str = parseFloat(strength.value);
    normalMap.make(heightMap.data, str);
    normalCanvas.update(normalMap.image);
}

function applyToShape() {
    //const mapTex = new THREE.CanvasTexture(heightCanvas.canvas);
    //shape.material.map = mapTex;
    const normTex = new THREE.CanvasTexture(normalCanvas.canvas);
    shape.material.normalMap = normTex;
    shape.material.needsUpdate = true;

};

let running = true;

const controls = byQsArray("#ui-ctrls input");

for ( const ctrl of controls) {
    ctrl.addEventListener("pointerdown", () => {
        running = false;
    });
    ctrl.addEventListener("pointerup", () => {
        applyNormal();
        applyToShape();
        running = true;
    });
}

const timer = new THREE.Clock();
const time = {dt: 0, elapsed: 0, timestamp: 0 };

function animate(timestamp) {
    time.dt = timer.getDelta();
    time.elapsed = timer.getElapsedTime();
    time.timestamp = timestamp;
    if ( true === running ) {
        shape.rotation.x += 0.002;
        shape.rotation.y += 0.003;
        shape.rotation.z += 0.007;
        renderer.render(scene, camera);
    }
    requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
