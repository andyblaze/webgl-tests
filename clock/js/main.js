import * as THREE from "three";
import { makeCamera, makeRenderer, makeLights, degToRad } from "./functions.js";
import GearWheel from "./gearwheel.js";
import Config from "./config.js";
import Clock from "./clock.js";
import GearShaft from "./gear-shaft.js";

const config = new Config(THREE);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111);

const camera = makeCamera(THREE);
const renderer = makeRenderer(THREE);

makeLights(THREE, scene);

const shaft1 = new GearShaft(THREE, config);
shaft1.setPosition(7, 0, 0);
scene.add(shaft1.native);

const shaft2 = new GearShaft(THREE, config);
shaft2.setPosition(-0.6, 2, 0);
scene.add(shaft2.native);

const shaft3 = new GearShaft(THREE, config);
shaft3.setPosition(-5.75, -2.15, 0);
scene.add(shaft3.native);

const gear1 = new GearWheel(
    THREE,
    { inner: 1, spokes: 5, teeth: 48, direction: 1, rpm: 1 },
    config
);
//shaft1.attach(gear1);
gear1.setPosition(7, 0, 0);

const gear2 = new GearWheel(
    THREE,
    { inner: 1, spokes: 3, teeth: 24 },
    config
);
gear2.setPosition(-0.6, 2, 0);
gear2.setRotation(0, degToRad(8), 0);

const gear3 = new GearWheel(
    THREE,
    { inner: 1, spokes: 4, teeth: 36 },
    config
);
gear3.setPosition(-5.75, -2.15, 0);
gear3.setRotation(0, degToRad(5), 0);

const gear4 = new GearWheel(
    THREE,
    { inner: 1, spokes: 2, teeth: 12 },
    config
);
gear4.setPosition(-10.7, -0.1, 0);
gear4.setRotation(0, degToRad(2), 0);

class GearTrain {
    constructor() {
        this.connections = [];
    }
    connect(gear1, gear2) {
        //const r = driver.toothCount / driven.toothCount;
        this.connections.push({
            driver: gear1,
            driven: gear2,
            ratio: gear1.toothCount / gear2.toothCount,
            velocity: gear1.velocity
        });
    }
    get gears() {
        return this.connections;
    }
    get size() {
        return this.connections.length;
    }
}

const gearTrain = new GearTrain();
gearTrain.connect(gear1, gear2);
gearTrain.connect(gear2, gear3);
gearTrain.connect(gear3, gear4);

//scene.add(gear4.native);

const clock = new Clock(THREE, gearTrain);
clock.addItem(gear1);
clock.addItem(gear2);
clock.addItem(gear3);
clock.addItem(gear4);
scene.add(clock.gears);

const timer = new THREE.Clock();

function animate(timestamp) {    
    const dt = timer.getDelta();
    const elapsed = timer.getElapsedTime();
    clock.update(dt, elapsed);
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}
requestAnimationFrame(animate);

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});