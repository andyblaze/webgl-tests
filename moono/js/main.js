import * as THREE from "three";

import Config from "./config.js";
import { makeCamera, makeRenderer } from "./functions.js";
import Lighting from "./lighting/lighting.js";
import MaterialsData from "./materials-data.js";
import Materials from "./materials.js";
import Rippling from "./effects/deformation.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { Water } from "./examples/jsm/objects/Water.js";

import { LightDimmer, Orbiter, ColorCycler, Rotater, Squasher, MapOffsetter } from "./effects/effects.js";
import { ShapeFactory } from "./shape-factory.js";
import Bend from "./curves/bend.js";
import { deg2rad } from "./functions.js";
import World from "./world.js";

const config = new Config(THREE, window);
const scene = new THREE.Scene();
const camera = makeCamera(THREE, config);
const renderer = makeRenderer(THREE, config);
const lighting = new Lighting(THREE);
const materials = new Materials(THREE, new MaterialsData(THREE));
const factory = new ShapeFactory(THREE);
const world = new World(scene);

const canvas = document.createElement("canvas");
canvas.width = 2;
canvas.height = 256;

const ctx = canvas.getContext("2d");
const gradient = ctx.createLinearGradient(0, 0, 0, 256);

gradient.addColorStop(0, "#000000");   // deep night
gradient.addColorStop(1, "#1f053b"); // dusky blue

ctx.fillStyle = gradient;
ctx.fillRect(0, 0, 2, 256);

const texture = new THREE.CanvasTexture(canvas);
texture.colorSpace = THREE.SRGBColorSpace;
scene.background = texture;

const water = new Water(new THREE.PlaneGeometry(128, 64), {
    textureWidth: 1024,
    textureHeight: 1024,
    waterNormals: new THREE.TextureLoader().load('textures/pave-normal.png', function (texture) {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    }),
    //sunDirection: new THREE.Vector3(0, 1, 125),
    sunColor: "#f53e22",
    waterColor: "#000000",
    distortionScale: 20,
    //alpha: 0.5,
    scale: 3,
    flowDirection: new THREE.Vector2(1, 1),
    reflectivity: 1
});
water.rotation.x = deg2rad(260);
water.position.y = -14;
water.position.z = -30;
scene.add(water);


//scene.fog = new THREE.Fog( 0xcccccc, -100, 235 );

lighting.add(scene, "ambient", { color: 0x000000, intensity: 0.1 }). //, angle: deg2rad(75), distance: 1950 }).
    setPosition(0, 50, -50).setTarget(0, 0, -20);
    //setShadows(true).setShadowMapSize(1024).
//addEffects([new ColorCycler(THREE, 0.04)]);

const moon = factory.create("sphere", materials.get("moonWorld"));
    moon.setPosition(0, -2, -48).
    setScale(8, 8, 8).
    addEffects([new Rotater()]);

const cloud1 = factory.create("plane", { width: 64, height: 64, wSegs: 32, hSegs: 32 }, materials.get("cloud"));
cloud1.setPosition(0, 3, -20).
    setRotation(deg2rad(60), 0, 0).
    setScale(5, 3, 1).
    addEffects([new MapOffsetter(23, 145)]);

const cloud2 = factory.create("plane", { width: 64, height: 64, wSegs: 32, hSegs: 32 }, materials.get("cloud2"));
cloud2.setPosition(0, 2, -20).
    setRotation(deg2rad(60), 0, 0).
    setScale(5, 3, 1).
    addEffects([new MapOffsetter(80, 245)]);

/*const mirror = factory.create(
    "mirror", 
    { width: 96, height: 64, texW: config.dprW, texH: config.dprH },
    { color: 0xffffff }
);
mirror.setPosition(0, -14, -30).
    setRotation(deg2rad(260), 0, 0);

//console.dir(mirror.threeObj.children[2]);*/

world.addLighting(lighting).add([
    cloud1, cloud2,
    moon//, mirror
]);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const timer = new THREE.Clock();
const time = { dt: 0,  elapsed: 0, timestamp: 0 };

function animate(timestamp) {
    time.dt = timer.getDelta();
    time.elapsed = timer.getElapsedTime();
    time.timestamp = timestamp;
    water.material.uniforms['time'].value += 0.0125 / 6;
    world.update(time);
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

requestAnimationFrame(animate);

window.addEventListener("resize", () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const aspect = w / h;
    camera.left = -10 * aspect;
    camera.right = 10 * aspect;
    camera.top = 7.5;
    camera.bottom = -7.5;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
    config.aspect = aspect;
    config.innerW = w;
    config.innerH = h;
});