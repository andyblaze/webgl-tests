import * as THREE from "./three.module.js";
import DeltaReport from "./delta-report.js";
import { byId, byQsArray } from "./functions.js";

function fixType(c) {
    const type = c.dataset.type;
    if ( type === "str" )   return c.value;
    if ( type === "float" ) return parseFloat(c.value);
    if ( type === "int" )   return parseInt(c.value);
    if ( type === "bool" )  return c.value === "1";
}

class Config {
    constructor(htmlElementId) {
        this.workspace = byId(htmlElementId);
        this.clientW = this.workspace.clientWidth;
        this.clientH = this.workspace.clientHeight;
        this.aspectRatio = this.clientW / this.clientH;
        this.material = {};
        this.lights = {};
        this.observers = [];
    }
    addObserver(o) {
        this.observers.push(o);
    }
    notify() {
        for ( const o of this.observers )
            o.update(this.material);
    }
    update(key, ctrls) {
        const item = this[key];
        for ( const c of ctrls )
            item[c.dataset.property] = fixType(c);
        //console.log(this.material);
    }
}

const config = new Config("workspace");

class UiControls {
    constructor(selector) {
        this.ctrls = byQsArray(selector);
        this.observers = [];
        for ( const ctrl of this.ctrls ) {
            ctrl.oninput = () => this.synch(ctrl);
        }
    }
    synch(ctrl) {
        const label = ctrl.dataset.label ?? null; 
        if ( typeof label === "string" )
            byId(label).textContent = ctrl.value;
        this.notify();
    }
    addObserver(o) {
        this.observers.push(o);
    }
    notify() {
        for ( const o of this.observers ) {
            o.update("material", this.ctrls);
            o.notify();
        }
    }
}

const uiControls = new UiControls("#material input")
uiControls.addObserver(config);
uiControls.notify();

class ThreeObject {
    constructor() {
        this.nativeObj = null;
    }
    get native() {
        return this.nativeObj;
    }    
}

class Renderer extends ThreeObject {
    constructor(three, cfg) {
        super();
        this.nativeObj = new three.WebGLRenderer({antialias: true});
        this.nativeObj.setSize(cfg.clientW, cfg.clientH);
        cfg.workspace.appendChild(this.nativeObj.domElement);
    }
    render(scene, camera) {
        this.nativeObj.render(scene, camera);
    }
}

class Camera extends ThreeObject {
    constructor(three, fov, aspect, near, far) {
        super();
        this.nativeObj = new three.PerspectiveCamera(fov, aspect, near, far);
        this.nativeObj.position.set(0, 0, 15);
    }
}

class Model extends ThreeObject {
    constructor(three, cfg) {
        super();
        this.geometry = new three.TorusKnotGeometry( 3, 1, 128, 64 );
        this.material = new three.MeshPhysicalMaterial(cfg.material);
        this.nativeObj = new three.Mesh(this.geometry, this.material);
    }
    update(material) {
        for ( const [prop, val] of Object.entries(material) ) {
            if ( typeof val === "string" )
                this.material[prop].set(val);
            else 
                this.material[prop] = val;
        }
    }
}

class Lighting {
    constructor() {
        this.lights = {};
    }
    ambient(three, id, col, strength) {
        this.lights[id] = new three.AmbientLight(col, strength);
        return this.lights[id];
    }
    directional(three, id, col, strength) {
        this.lights[id] = new three.DirectionalLight(col, strength);
        return this.lights[id];
    }
    setPosition(id, x, y, z) {
        this.lights[id].position.set(x, y, z);
    }
    setColor(id, col) {
        this.lights[id].color.set(col);
    }
    setStrength(id, strength) {
        this.lights[id].intensity = strength;
    }
}

const renderer = new Renderer(THREE, config);
const scene = new THREE.Scene();
const lighting = new Lighting();
const camera = new Camera(THREE, 60, config.aspectRatio, 0.1, 100);
const model = new Model(THREE, config);

config.addObserver(model);

const ctrl = byId("dir2");
ctrl.oninput = () => {
    lighting.setColor("dir2", ctrl.value);
};

scene.add(model.native);
scene.add(lighting.ambient(THREE, "amb1", 0xffffff, 2));
scene.add(lighting.directional(THREE, "dir1", 0xc60000, 2));
scene.add(lighting.directional(THREE, "dir2", 0x00c600, 2));
lighting.setPosition("dir1", 0, 0, 7);
lighting.setPosition("dir2", -8, 8, 7);

const clock = new THREE.Clock();
const cube = model.native;

function animate(timestamp) {    
    const dt = clock.getDelta(); 
    const elapsedTime = clock.getElapsedTime();
    cube.rotation.x += 0.0017;
    cube.rotation.y += 0.0011;
    cube.rotation.z += 0.008;

    renderer.render(scene, camera.native);

    DeltaReport.log(timestamp);
    requestAnimationFrame(animate);
}

animate(performance.now());