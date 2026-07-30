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
        this.observers = [];
    }
    addObserver(o) {
        this.observers.push(o);
    }
    notify() {
        for ( const o of this.observers )
            o.update(this.material);
    }
    update(ctrls) {
        for ( const c of ctrls )
            this.material[c.dataset.property] = fixType(c);
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
            o.update(this.ctrls);
            o.notify();
        }
    }
}

const uiControls = new UiControls("#ui-panel input")
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
    constructor(three, aspect) {
        super();
        this.nativeObj = new three.PerspectiveCamera(60, aspect, 0.1, 100);
        this.nativeObj.position.set(0, 0, 15);
    }
}

class Model extends ThreeObject {
    constructor(three, cfg) {
        super();
        this.geometry = new three.BoxGeometry(6, 6, 6);
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
    ambient(three, id) {
        this.lights[id] = new three.AmbientLight(0xffffff, 2);
        return this.lights[id];
    }
    directional(three, id, col) {
        this.lights[id] = new THREE.DirectionalLight(col, 1);
        return this.lights[id];
    }
    setPosition(id, x, y, z) {
        this.lights[id].position.set(x, y, z);
    }
}

const renderer = new Renderer(THREE, config);
const scene = new THREE.Scene();
const lighting = new Lighting();
const camera = new Camera(THREE, config.aspectRatio);
const model = new Model(THREE, config);

config.addObserver(model);

scene.add(model.native);
scene.add(lighting.ambient(THREE, "amb1"));
scene.add(lighting.directional(THREE, "dir1", 0xc60000));
scene.add(lighting.directional(THREE, "dir2", 0x0000c6));
lighting.setPosition("dir1", -10, 16, 10);
lighting.setPosition("dir2", 10, -16, 10);

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