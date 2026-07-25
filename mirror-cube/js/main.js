import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { mt_rand } from "./functions.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { RectAreaLightHelper } from "three/addons/helpers/RectAreaLightHelper.js";
import Config from "./config.js";
//import Cube from "./cube.js";
import SphereManager from "./sphere-manager.js";


const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(innerWidth, innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputColorSpace = THREE.SRGBColorSpace;
document.body.appendChild(renderer.domElement);


const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);
const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(512, {
    generateMipmaps: true,
    minFilter: THREE.LinearMipmapLinearFilter
});

const cubeCamera = new THREE.CubeCamera(
    0.1,
    100,
    cubeRenderTarget
);

scene.add(cubeCamera);

const camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 100);
camera.position.set(0, 0, 2);

new OrbitControls(camera, renderer.domElement);


const config = new Config(THREE);

class Cube {
    constructor(three, cfg, scene) {
        this.visible = true;
        const loader = new three.TextureLoader();
        const canvasTexture = loader.load("canvas.png");
        const normalTexture = loader.load("normal.png");

        this.cube = new three.Mesh(
            new RoundedBoxGeometry(cfg.cubeSize, cfg.cubeSize, cfg.cubeSize, 6, 0.08),
            new three.MeshPhysicalMaterial({
                color: 0x444444,
                transparent: true,
                opacity: 1,

                metalness: 1,
                roughness: 0.08,

                clearcoat: 1,
                clearcoatRoughness: 0.05,

                envMap: cubeRenderTarget.texture,
                envMapIntensity: 8,

                reflectivity: 1,
                ior: 1.5,

                normalMap: normalTexture,
                normalScale: new three.Vector2(0.15, 0.15)

            })
        );
        this.cube.position.copy(cfg.cubeCentre);
        scene.add(this.cube);
        const shellSize = cfg.cubeSize * 1.0125;

        const geometry = new RoundedBoxGeometry(shellSize, shellSize, shellSize, 6, 0.08);

        this.shell = new three.Mesh(
            geometry,
            new three.MeshBasicMaterial({
                color:0xffffff,
                transparent:true,
                opacity:0.05,
                ior: 1.5
            })
        );

        this.shell.position.copy(this.cube.position);
        scene.add(this.shell);
    }
    update(elapsed) {
        this.cube.rotation.x = elapsed * 0.07;
        this.cube.rotation.y = elapsed * 0.09;
        this.cube.rotation.z = elapsed * 0.08;
        this.shell.rotation.x = elapsed * 0.07;
        this.shell.rotation.y = elapsed * 0.09;
        this.shell.rotation.z = elapsed * 0.08;
    }
    getPosition() {
        return this.cube.position;
    }
    toggleVisibilty() {
        this.cube.visible = !this.cube.visible;
    }
}


const cube = new Cube(THREE, config, scene);

// lighting

scene.add(new THREE.AmbientLight(0xffffff, 2));
const key = new THREE.DirectionalLight(0xffffff, 2);
key.position.set(4, 5, 6);
scene.add(key);

const fill = new THREE.DirectionalLight(0x88aaff, 0.6);
fill.position.set(-5, -2, 3);
scene.add(fill);

const areaLight = new THREE.RectAreaLight(0xffffff, 4, 8, 8);

areaLight.position.set(0, 3, 2);
areaLight.lookAt(cube.getPosition());

const rimLight = new THREE.DirectionalLight(0x6688ff, 2);

rimLight.position.set(-5, 5, -5);
scene.add(areaLight);
rimLight.lookAt(cube.getPosition());

scene.add(rimLight);


const sphereManager = new SphereManager(THREE);
sphereManager.createSpheres(THREE, config, scene);

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
/*composer.addPass(
    new UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), 0.6, 0.5, 0.2)
);*/

const clock = new THREE.Clock();

function animate(){

    const elapsed = clock.getElapsedTime();

    sphereManager.update(elapsed);

    const pulse = (Math.sin(elapsed * 0.5) + 1) * 0.5;
    areaLight.intensity = 3 + pulse * 2;

    cube.update(elapsed);

    // capture environment from cube position
    cube.toggleVisibilty();

    cubeCamera.position.copy(cube.getPosition());
    cubeCamera.update(renderer, scene);

    cube.toggleVisibilty();

    composer.render();

    requestAnimationFrame(animate);
}

animate();

addEventListener('resize', ()=>{
    camera.aspect=innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
    composer.setSize(innerWidth, innerHeight);}
);
