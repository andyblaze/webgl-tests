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

class Land {
    constructor(three) {

        const segments = 256;
        const size = 20;

        const geometry = new three.PlaneGeometry(
            size,
            size,
            segments,
            segments
        );

        // Rotate plane to lie horizontally
        geometry.rotateX(-Math.PI / 2);

        const positions = geometry.attributes.position;
        this.createTerrain(positions);

        positions.needsUpdate = true;
        geometry.computeVertexNormals();       
        
        const loader = new three.TextureLoader();
        const texmap = loader.load("textures/marble-normal.png");
        texmap.wrapS = three.RepeatWrapping;
        texmap.wrapT = three.RepeatWrapping;

        texmap.repeat.set(2, 2);

        const material = new three.MeshPhysicalMaterial({
            color: 0x00000e, transmission: 0.2,
            roughness: 1, metalness: 0,
            emissive: 0x02200e, emissiveIntensity: 0.1,
            sheenColor: 0x00000e, sheen: 0.18,
            side: THREE.DoubleSide,
            normalScale: new THREE.Vector2(2, 2),
            normalMap: texmap
        });

        this.terrain = new three.Mesh(geometry, material);

        this.terrain.receiveShadow = true;
        this.terrain.castShadow = true;        
    }
    createTerrain(positions) {
        for ( let i = 0; i < positions.count; i++ ) {

            const x = positions.getX(i);
            const z = positions.getZ(i);

            // Distance from centre
            const distance = Math.sqrt(x*x + z*z);

            // Radial falloff
            const radius = 18;
            const falloff = Math.max(0, 2 - distance / radius);

            // Original terrain waves
            let height = 0;

            height += Math.sin(x * 0.25) * 1.5;
            height += Math.cos(z * 0.3) * 1.5;
            height += Math.sin((x + z) * 0.18) * 2.0;

            // Apply falloff
            height *= falloff;

            positions.setY(i, height);
        }
    }
}

const land = new Land(THREE);
land.terrain.position.y = -16;
land.terrain.position.z = -48;
land.terrain.position.x = 28;
land.terrain.scale.set(4, 0.5);

scene.add(land.terrain);

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

const water = factory.create("water");
water.setRotation(deg2rad(260), 0, 0).
    setPosition(0, -14, -30);

lighting.add(scene, "ambient", { color: 0xffffff, intensity: 0.01 }). //, angle: deg2rad(75), distance: 1950 }).
    setPosition(0, 50, -50).setTarget(0, 0, -20);

const moon = factory.create("sphere", materials.get("moonWorld"));
    moon.setPosition(0, -2, -48).
    setScale(8, 8, 8).
    addEffects([new Rotater()]);

const cloud1 = factory.create("plane", { width: 64, height: 64, wSegs: 32, hSegs: 32 }, materials.get("cloud"));
cloud1.setPosition(0, 3, -20).
    setRotation(deg2rad(60), 0, 0).
    setScale(5, 3, 1).
    addEffects([new MapOffsetter(-23, -145)]);

const cloud2 = factory.create("plane", { width: 64, height: 64, wSegs: 32, hSegs: 32 }, materials.get("cloud2"));
cloud2.setPosition(0, 2, -20).
    setRotation(deg2rad(60), 0, 0).
    setScale(5, 3, 1).
    addEffects([new MapOffsetter(-80, -245)]);

world.addLighting(lighting).add([
    cloud1, cloud2, water,
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