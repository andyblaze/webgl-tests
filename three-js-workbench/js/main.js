import * as THREE from "./three.module.js";
import DeltaReport from "./delta-report.js";
import { byId } from "./functions.js";

class Config {
    constructor(htmlElementId) {
        this.workspace = byId(htmlElementId);
        this.clientW = this.workspace.clientWidth;
        this.clientH = this.workspace.clientHeight;
        this.aspectRatio = this.clientW / this.clientH;
        this.material = {
            color: 0xff0000,
            roughness: 0.25,
            metalness: 0.03,
            transmission: 0.2,
            transparent: true,
            opacity: 1,
            clearcoat: 1,
            clearcoatRoughness: 0.5,
            emissive: 0xff00ff,
            emissiveIntensity: 0.5,
            ior: 1.5,
            iridescence: 0.5,
            iridescenceIOR: 1.3,
            reflectivity: 0.5,
            sheen: 0.2,
            sheenColor: 0x0000ff,
            thickness: 0.5,
            anisotropy: 1,
            attenuationColor: 0x00ff00
        };
    }
}

const config = new Config("workspace");

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
        const geometry = new three.SphereGeometry(5, 32, 32);
        const material = new three.MeshPhysicalMaterial(cfg.material);
        this.nativeObj = new three.Mesh( geometry, material );
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
    directional(three, id) {
        this.lights[id] = new THREE.DirectionalLight(0xc6c6c6, 1);
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

scene.add(model.native);
scene.add(lighting.ambient(THREE, "amb1"));
scene.add(lighting.directional(THREE, "dir1"));
lighting.setPosition("dir1", 0, 10, 12);

const clock = new THREE.Clock();

function animate(timestamp) {    
    const dt = clock.getDelta(); 
    const elapsedTime = clock.getElapsedTime();

    renderer.render(scene, camera.native);

    DeltaReport.log(timestamp);
    requestAnimationFrame(animate);
}

animate(performance.now());