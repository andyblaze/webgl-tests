import * as THREE from "three";

import Config from "./config.js";
import { makeCamera, makeRenderer } from "./functions.js";
import Lighting from "./lighting/lighting.js";
import Materials from "./materials.js";
import Deformation from "./effects/deformation.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { LightDimmer, Orbiter, ColorCycler, Rotater } from "./effects/effects.js";
import { ShapeFactory } from "./shape-factory.js";
import { deg2rad } from "./functions.js";
import World from "./world.js";

const config = new Config(THREE, window);
const scene = new THREE.Scene();
const camera = makeCamera(THREE, config);
const renderer = makeRenderer(THREE, config);
const lighting = new Lighting(THREE);
const materials = new Materials(THREE);
const factory = new ShapeFactory(THREE);
const world = new World(scene);

/*lighting.add(scene, "point", { color: 0xff0000, intensity: 80 }).
    setPosition(0, 8, 0).
    setShadows(true).
    setShadowMapSize(1024).
    addEffects([new LightDimmer(0.2, 0.1), new ColorCycler(THREE, 0.01)]);*/

lighting.add(scene, "spot", { color: 0xff0000, intensity: 80, angle: deg2rad(35), distance: 15 }).
    setPosition(0, 9, 5).setTarget(0, 0, 0).
    setShadows(true).setShadowMapSize(1024).
addEffects([new ColorCycler(THREE, 0.04)]);

lighting.add(scene, "spot", { color: 0x00ff00, intensity: 80, angle: deg2rad(35), distance: 15 }).
    setPosition(5, 5, 5).setTarget(0, 0, 0).
addEffects([new ColorCycler(THREE, 0.07)]);

lighting.add(scene, "spot", { color: 0x0000ff, intensity: 80, angle: deg2rad(35), distance: 15 }).
    setPosition(-5, 5, 5).setTarget(0, 0, 0).
addEffects([new ColorCycler(THREE, 0.011)]);

/*lighting.add(scene, "point", { color: 0x00ff00, intensity: 80 }).
    setPosition(-6, -2, 2).
    addEffects([new LightDimmer(0.2, 0.2), new ColorCycler(THREE, 0.04)]);

lighting.add(scene, "point", { color: 0x0000ff, intensity: 80 }).
    setPosition(6, -2, 2).
    addEffects([new LightDimmer(0.5, 0.5), new ColorCycler(THREE, 0.07)]);

lighting.add(scene, "point", { color: 0x0000ff, intensity: 120 }).
    setPosition(-4, 0, 8).
    addEffects([new LightDimmer(0.5, 0.5), new ColorCycler(THREE, 0.11)]);

lighting.add(scene, "point", { color: 0x0000ff, intensity: 120 }).
    setPosition(4, 0, 8).
    addEffects([new LightDimmer(0.5, 0.5), new ColorCycler(THREE, 0.13)]);*/

/*const egg = factory.create("sphere", materials.get("brushedMetal"));
egg.setShadows(true, true).setPosition(0, 0, 4).dimple();
egg.addEffects([new Orbiter(2, 0.23, "y"), new Rotater()]);

const torus = factory.create("torus", { radius: 0.75, tube: 0.25 }, materials.get("fireWorld"));
torus.setShadows(true, true).setScale(1, 1.25, 1).setPosition(3, 0, 3);
torus.addEffects([new Orbiter(2, 0.29, "z"), new Rotater()]);*/

/*const pot = factory.create("flowerpot", materials.get("greenWorld"));
pot.setShadows(true, true).setScale(0.5, 1, 1).setPosition(0, 0, 0);
pot.addEffects([new Orbiter(4, 0.31, "x"), new Rotater()]);*/

/*const floor = factory.create("hidefPlane", materials.get("floor")); 
floor.setShadows(false, true).setRotation(deg2rad(80), 0, 0).
setPosition(0, -6, -8.5).addEffects([new Deformation()]);

const spikes = factory.create("spikyCube", materials.get("iceWorld"));
spikes.setShadows(true, true).setPosition(0, -2, 0);
spikes.addEffects([new Orbiter(4, 0.31, "y"), new Rotater(3, 4, 5)]);*/

class HelixCurve extends THREE.Curve {

    constructor(width, pitch, phase=0) {
        super();

        this.radius = width / 2;
        this.pitch = pitch;
        this.phase = phase;
    }

    getPoint(t, optionalTarget = new THREE.Vector3()) {

        const angle = 2 * Math.PI * t + this.phase;

        const x = this.radius * Math.cos(angle);
        const y = this.pitch * t;
        const z = this.radius * Math.sin(angle);

        return optionalTarget.set(x, y, z);
    }
}

class HelixSegment {
    constructor(three, geo, mat, phase=0) {
        const { width, pitch, tubeRadius, tubularSegments, radialSegments } = geo;
        this.geometry = new three.TubeGeometry(new HelixCurve( width, pitch, phase), tubularSegments, tubeRadius, radialSegments);
        this.material = new three.MeshPhysicalMaterial(mat);
        this.threeObj = new three.Mesh(this.geometry, this.material);
    }
    get native() {
        return this.threeObj;
    }
}

class Dna {
    constructor(three) {
        this.three = three;
        this.threeObj = new three.Group();
    }
    addSegments(n, geo, mat) {
        for ( let i = 0; i < n; i++ ) {
            const a = new HelixSegment(this.three, geo, mat, 0);
            const b = new HelixSegment(this.three, geo, mat, Math.PI);

            a.native.position.y = geo.pitch * i;
            b.native.position.y = geo.pitch * i;

            this.threeObj.add(a.native);
            this.threeObj.add(b.native);
        }
    }
    center() {
        const box = new this.three.Box3().setFromObject(this.threeObj);
        const size = new this.three.Vector3();
        box.getSize(size);
        this.threeObj.position.y = -size.y / 2;
    }
    get native() {
        return this.threeObj;
    }
}

const dna = new Dna(THREE);
const geo = { width: 1.5, pitch: 1.5, tubeRadius: 0.05, tubularSegments: 48, radialSegments: 8 };
const mat = materials.get("iceWorld");
dna.addSegments(7, geo, mat);
dna.center();
//dna.native.position.y = -5.2;
dna.native.rotation.z = deg2rad(45);
scene.add(dna.native);

world.addLighting(lighting);//.add([tube]);

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