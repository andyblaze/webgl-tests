import * as THREE from "three";

import Config from "./config.js";
import { makeCamera, makeRenderer } from "./functions.js";
import Box from "./box.js";
import TorusKnot from "./torusknot.js";
import Floor from "./floor.js";
import { LightFactory, LightRegistry } from "./light-factory.js";
import Light from "./light.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { LightDimmer, Orbiter, ColorCycler } from "./effects.js";

const config = new Config(THREE, window);
const scene = new THREE.Scene();
const camera = makeCamera(THREE, config);
const renderer = makeRenderer(THREE, config);

class Lighting {
    constructor(fctry) {
        this.factory = fctry;
        this.lights = [];
        this.index = -1;
    }
    add(type, cfg) {
        this.lights.push(new Light(this.factory, type, cfg));
        this.index++;
        scene.add(this.lights[this.index].native);
        return this.lights[this.index];
    }
}

const factory = new LightFactory(new LightRegistry(THREE));
//const lighting = new Lighting(new LightFactory(new LightRegistry(THREE)));

const light1 = new Light(factory, "point", { color: 0xff0000, intensity: 80 });
light1.
    setPosition(0, 5, 0).
    setShadows(true).
    setShadowMapSize(1024).
    addEffects([
        new LightDimmer(0.2, 0.1),
        new ColorCycler(THREE, 0.01)
    ]).
    addTo(scene);

const light2 = new Light(factory, "point", { color: 0x00ff00, intensity: 80 });
light2.setPosition(-10, 5, 5);
light2.addEffects([new LightDimmer(0.2, 0.2)]).addTo(scene);

const light3 = new Light(factory, "point", { color: 0x0000ff, intensity: 80 });
light3.setPosition(5, -5, -5);
light3.addEffects([new LightDimmer(0.5, 0.5)]).addTo(scene);

const torusknot = new TorusKnot(
    THREE, 
    1, 0.125,
    { color: 0xff0000, transparent: true, opacity: 0 }
);
torusknot.setShadows(true, true).setPosition(0, 8, 0);
torusknot.addTo(scene);

const box = new Box(THREE, 2, { color: 0xffffff });
box.addEffects([new Orbiter(4, 0.25)]);
box.setShadows(false, false).setPosition(0, 0, 0);
box.addTo(scene);

const plane = new Floor(THREE, 24, { color: 0xffffff, side: THREE.DoubleSide });
plane.setShadows(false, true);
plane.addTo(scene);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const timer = new THREE.Clock();

function animate() {
    const dt = timer.getDelta();
    const elapsed = timer.getElapsedTime(); 
    light1.update(dt, elapsed);
    light2.update(dt, elapsed);
    light3.update(dt, elapsed);
    torusknot.update(dt, elapsed);
    box.update(dt, elapsed);
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