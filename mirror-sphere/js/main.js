import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { mt_rand } from "./functions.js";
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

const cube = new Cube(THREE, config, cubeRenderTarget, scene);

// lighting

function addLighting(three, scene, cube) {

    scene.add(new three.AmbientLight(0xffffff, 2));
    const key = new three.DirectionalLight(0xffffff, 2);
    key.position.set(4, 5, 6);
    scene.add(key);

    const fill = new three.DirectionalLight(0x88aaff, 0.6);
    fill.position.set(-5, -2, 3);
    scene.add(fill);

    const areaLight = new three.RectAreaLight(0xffffff, 4, 8, 8);
    areaLight.position.set(0, 3, 2);
    areaLight.lookAt(cube.getPosition());
    scene.add(areaLight);

    const rimLight = new three.DirectionalLight(0x6688ff, 2);
    rimLight.position.set(-5, 5, -5);
    rimLight.lookAt(cube.getPosition());
    scene.add(rimLight);
    return areaLight;
}

const areaLight = addLighting(THREE, scene, cube);

const sphereManager = new SphereManager(THREE, config);
sphereManager.createSpheres(THREE, config, scene);

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));

const clock = new THREE.Clock();

function animate() {
    const delta = clock.getDelta();
    const elapsed = clock.getElapsedTime();

    sphereManager.update(delta, elapsed, config);

    const pulse = (Math.sin(elapsed * config.lightPulseSpeed) + 1) * 0.5;
    areaLight.intensity = config.lightPulseBaseIntensity + pulse * config.lightPulseRange;

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
