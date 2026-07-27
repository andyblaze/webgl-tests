import * as THREE from "three";
//import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
//import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { mt_rand } from "./functions.js";
//import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
//import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
//import { RectAreaLightHelper } from "three/addons/helpers/RectAreaLightHelper.js";
import Config from "./config.js";
import Cube from "./cube.js";
import SphereManager from "./sphere-manager.js";

const config = new Config(THREE);

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(innerWidth, innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputColorSpace = THREE.SRGBColorSpace;
document.body.appendChild(renderer.domElement);


const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x000000, config.fogNear, config.fogFar);

const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(512, {
    generateMipmaps: true,
    minFilter: THREE.LinearMipmapLinearFilter
});

const cubeCamera = new THREE.CubeCamera(0.1, 100, cubeRenderTarget);
scene.add(cubeCamera);

const camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 100);
camera.position.set(0, 0, 2);

//new OrbitControls(camera, renderer.domElement);




const cube = new Cube(THREE, config, cubeRenderTarget, scene);

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


const sphereManager = new SphereManager(THREE, config);
sphereManager.createSpheres(THREE, config, scene);

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
/*composer.addPass(
    new UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), 0.6, 0.5, 0.2)
);*/

const clock = new THREE.Clock();

function animate() {

    const elapsed = clock.getElapsedTime();

    sphereManager.update(elapsed, config);

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
