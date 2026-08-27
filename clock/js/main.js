import * as THREE from "three";
import { makeCamera, makeRenderer, degToRad } from "./functions.js";
import GearWheel from "./gearwheel.js";
import Config from "./config.js";
import Clock from "./clock.js";
import GearShaft from "./gear-shaft.js";
import GearTrain from "./geartrain.js";
import SpokedGear from "./spoked-gear.js";
import PinionGear from "./pinion-gear.js";
import HoledGear from "./holed-gear.js";
import Lights from "./lights.js";

const config = new Config(THREE);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111);

const camera = makeCamera(THREE);
const renderer = makeRenderer(THREE);

const lights = new Lights(THREE);
lights.create(THREE, scene);

function makeShaft(three, scene, name, cfg) {
    const s = new GearShaft(THREE, name, cfg);
    scene.add(s.native);
    return s;
}

const shaft1 = makeShaft(THREE, scene, "shaft1", config);
const shaft2 = makeShaft(THREE, scene, "shaft2", config);
const shaft3 = makeShaft(THREE, scene, "shaft3", config);
const shaft4 = makeShaft(THREE, scene, "shaft4", config);

const gear1 = new GearWheel(THREE, "gear1", config, new PinionGear());
const gear2 = new GearWheel(THREE, "gear2", config, new SpokedGear());
const gear3 = new GearWheel(THREE, "gear3", config, new SpokedGear());
const gear4 = new GearWheel(THREE, "gear4", config, new HoledGear());

shaft1.attach(gear1);
shaft2.attach(gear2);
shaft3.attach(gear3);
shaft4.attach(gear4);

const gearTrain = new GearTrain();
gearTrain.connect(gear1, gear2);
gearTrain.connect(gear2, gear3);
gearTrain.connect(gear3, gear4);
gearTrain.init();

const clock = new Clock(THREE, gearTrain);
clock.addItem(gear1);
clock.addItem(gear2);
clock.addItem(gear3);
clock.addItem(gear4);
scene.add(clock.gears);

const timer = new THREE.Clock();

class RpmReporter {

    constructor(reporting=false, interval = 2) {
        this.lastReportTime = 0;
        this.reporting = reporting;
        this.interval = interval;
    }

    shouldReport(elapsed) {
        if ( false === this.reporting ) return false;
        if (elapsed - this.lastReportTime < this.interval) {
            return false;
        }

        this.lastReportTime = elapsed;
        return true;
    }

    log(name, gear) {
        console.log(name, gear.rpmReport);
    }
}

const rpmReport = new RpmReporter();

function animate(timestamp) {    
    const dt = timer.getDelta();
    const elapsed = timer.getElapsedTime();
    lights.update(dt);
    clock.update(dt, elapsed);
    if (rpmReport.shouldReport(elapsed)) {
        rpmReport.log("gear1:", gear1);
        rpmReport.log("gear2:", gear2);
        rpmReport.log("gear3:", gear3);
        rpmReport.log("gear4:", gear4);
    }
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}
requestAnimationFrame(animate);

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});