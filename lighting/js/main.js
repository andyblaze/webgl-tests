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

lighting.add(scene, "point", { color: 0x00ffff, intensity: 60 }).
    setPosition(-5, -3, 0).
addEffects([new LightDimmer(0.9, 0.02), new ColorCycler(THREE, 0.01)]);

lighting.add(scene, "spot", { color: 0x0000ff, intensity: 80, angle: deg2rad(35), distance: 15 }).
    setPosition(0, 9, 5).setTarget(-3, 0, 0).
    setShadows(true).setShadowMapSize(1024).
addEffects([new ColorCycler(THREE, 0.04)]);

lighting.add(scene, "spot", { color: 0x00ff00, intensity: 80, angle: deg2rad(35), distance: 15 }).
    setPosition(5, 5, 5).setTarget(0, 0, 0).
addEffects([new ColorCycler(THREE, 0.07)]);

lighting.add(scene, "spot", { color: 0x0000ff, intensity: 80, angle: deg2rad(35), distance: 15 }).
    setPosition(-5, 5, 5).setTarget(0, 0, 0).
addEffects([new ColorCycler(THREE, 0.011)]);

const egg = factory.create("sphere", materials.get("brushedMetal"));
egg.setShadows(true, true).setPosition(0, 0, 4).dimple();
egg.addEffects([new Orbiter(2, 0.23, "y"), new Rotater()]);

const torus = factory.create("torus", { radius: 0.75, tube: 0.25 }, materials.get("fireWorld"));
torus.setShadows(true, true).setScale(1, 1.25, 1).setPosition(3, 0, 3);
torus.addEffects([new Orbiter(2, 0.29, "z"), new Rotater()]);

const hedron = factory.create("dodecahedron", materials.get("pinkMetal"));
hedron.setShadows(true, true).setPosition(-3, 0, 0);
hedron.addEffects([new Orbiter(3, 0.31, "x"), new Rotater()]);

const floor = factory.create("hidefPlane", materials.get("floor")); 
floor.setShadows(false, true).setRotation(deg2rad(80), 0, 0).
setPosition(0, -6, -8.5).addEffects([new Deformation()]);

const box = factory.create("flexiBox", materials.get("brushedBrass"));
box.setShadows(true, true).setPosition(1, -2, 2).pullSide(0.5, 0.5);
box.addEffects([new Rotater()]);

/*const mirror = factory.create(
    "mirror", 
    { width: 5, height: 5, texW: config.dprW, texH: config.dprH },
    { color: 0xffffff }
);
mirror.setPosition(-8, 0, 0).setRotation(0, deg2rad(55), 0);*/

world.addLighting(lighting).add([egg, torus, hedron, floor, box]);//, mirror]);

// ------------------------------------------------------------
// A simple curve
// ------------------------------------------------------------

class Curve {
    constructor(three) {
        this.curve = new three.CatmullRomCurve3([
            new three.Vector3(0, 0, 0),
            new three.Vector3(1, 1, 0),
            new three.Vector3(2, 2, 0),
            new three.Vector3(3, 3, 1),
        ]);
        this.curveGeometry = new three.BufferGeometry().setFromPoints(
            this.curve.getPoints(50)
        );
        this.curveLine = new three.Line(
            this.curveGeometry,
            new three.LineBasicMaterial()
        );
    }
    get native() {
        return this.curveLine;
    }
}
const curve = new Curve(THREE);
scene.add(curve.native);


class Cone {
    constructor(three) {
        this.geometry = new three.ConeGeometry(
            0.5,   // radius
            3,     // height
            16,    // radial segments
            32     // height segments
        );
        this.material = new three.MeshNormalMaterial();

        const position = this.geometry.attributes.position;

        for ( let i = 0; i < position.count; i++ ) {
            position.setY(i, position.getY(i) + 1.5);
        }

        position.needsUpdate = true;        

        this.cone = new three.Mesh(
            this.geometry,
            this.material
        );
    }
    get native() {
        return this.cone;
    }
}

function bendConeAlongCurve(geometry, curve, height) {

    const position = geometry.attributes.position;

    const point = new THREE.Vector3();
    const tangent = new THREE.Vector3();

    // We'll use this to rotate the cone's original Y axis
    // so that it follows the curve.
    const quaternion = new THREE.Quaternion();

    for (let i = 0; i < position.count; i++) {

        // Original position on the straight cone
        const x = position.getX(i);
        const y = position.getY(i);
        const z = position.getZ(i);

        // How far along the cone?
        const t = y / height;

        // Where are we on the curve?
        curve.getPointAt(t, point);

        // Which direction is the curve travelling here?
        curve.getTangentAt(t, tangent);

        // Rotate the cone's Y axis so it points
        // along the curve.
        quaternion.setFromUnitVectors(
            new THREE.Vector3(0, 1, 0),
            tangent
        );

        // Take the vertex's distance from the cone centre
        // and rotate that around the curve.
        const offset = new THREE.Vector3(x, 0, z);

        offset.applyQuaternion(quaternion);

        // Put the vertex around the curve.
        position.setXYZ(
            i,
            point.x + offset.x,
            point.y + offset.y,
            point.z + offset.z
        );
    }

    position.needsUpdate = true;
}


const cone = new Cone(THREE);

bendConeAlongCurve(cone.geometry, curve.curve, 3);

scene.add(cone.native);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const timer = new THREE.Clock();
const time = { dt: 0,  elapsed: 0, timestamp: 0 };

function animate(timestamp) {
    time.dt = timer.getDelta();
    time.elapsed = timer.getElapsedTime();
    time.timestamp = timestamp;
    world.update(time);
    //dna.update(time.dt);
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