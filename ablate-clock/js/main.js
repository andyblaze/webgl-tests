import Config from "./config.js";
import Hand from "./hand.js";
import Ablation from "./ablation.js";
import Clock from "./clock.js";
import ClockFace from "./clock-face.js";
import { makeCamera, makeRenderer, deg2rad } from "./functions.js";
import Phaser from "./phaser.js";
import Lights from "./lights.js";
import SkyDome from "./sky.js";
import StarsDecor from "./stars.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

import * as THREE from "three";

const config = new Config(window);

const scene = new THREE.Scene();
const camera = makeCamera(THREE, config);
const renderer = makeRenderer(THREE, config);

const sky = new SkyDome(THREE, new StarsDecor(THREE, 2000));
sky.addToScene(scene);

const lights = new Lights(THREE);
lights.create(THREE, scene);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const clockFace = new ClockFace(THREE);
scene.add(clockFace.native);

const markers = {
    twelve: { 
        rotation: new THREE.Euler(0, deg2rad(90), deg2rad(90)),
        position: new THREE.Vector3(0, 0, -1)
    },
    three: { 
        rotation: new THREE.Euler(0, 0, 0),
        position: new THREE.Vector3(0, 0, -1)
    },
    two: { 
        rotation: new THREE.Euler(0, deg2rad(0), deg2rad(30)),
        position: new THREE.Vector3(0, 0, -1)
    },
    one: { 
        rotation: new THREE.Euler(0, deg2rad(0), deg2rad(60)),
        position: new THREE.Vector3(0, 0, -1)
    },
    eleven: { 
        rotation: new THREE.Euler(0, deg2rad(0), deg2rad(120)),
        position: new THREE.Vector3(0, 0, -1)
    },
    ten: { 
        rotation: new THREE.Euler(0, deg2rad(0), deg2rad(150)),
        position: new THREE.Vector3(0, 0, -1)
    }
};

const mrkrs = [];

for ( const [id, m] of Object.entries(markers) ) {
    const mrkr = new THREE.Mesh(
        new THREE.BoxGeometry(9.5, 0.1, 0.1),
        new THREE.MeshPhysicalMaterial({
            color: 0x0dc4fc,
            transparent: true,
            opacity: 0.25,
            emissive:0xff0000, //0dc4fc,
            emissiveIntensity:0.75
        })
    );
    mrkr.rotation.copy(m.rotation); 
    mrkr.position.copy(m.position);
    scene.add(mrkr);    
}
//scene.add(mrkrs);
const secondHand = new Hand(THREE, "secondHand", config);
secondHand.addAblation(new Ablation(THREE), scene);
scene.add(secondHand.native);
const minuteHand = new Hand(THREE, "minuteHand", config);
minuteHand.addAblation(new Ablation(THREE), scene);
scene.add(minuteHand.native);
const hourHand = new Hand(THREE, "hourHand", config);
hourHand.addAblation(new Ablation(THREE), scene);
scene.add(hourHand.native);

const clock = new Clock(new Phaser());
clock.add(secondHand).add(minuteHand).add(hourHand);
clock.addFace(clockFace);

const timer = new THREE.Clock();

function animate() {
    const dt = timer.getDelta();
    const elapsed = timer.getElapsedTime(); 
    clock.update(dt, elapsed);
    controls.update();
    lights.update(dt);
    sky.update();
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