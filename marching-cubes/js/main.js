import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { MarchingCubes } from "three/addons/objects/MarchingCubes.js";
import { mt_rand } from "./functions.js";


const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(innerWidth, innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputColorSpace = THREE.SRGBColorSpace;
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 100);
camera.position.set(0, 0, 24);

new OrbitControls(camera, renderer.domElement);

scene.add(new THREE.AmbientLight(0xffffff, 2));

const dl = new THREE.DirectionalLight(0xc6c6c6, 1);
dl.position.set(0, 10, 12);
scene.add(dl);

const material = new THREE.MeshPhysicalMaterial({
    color: 0x00ff00,
    roughness: 0.25,
    metalness: 0.03,
    transmission: 0.2,
    clearcoat: 1
});

const resolution = 64;

const metaball = new MarchingCubes(
    resolution,
    material,
    true,
    true
);

metaball.position.set(0, 0, 0);
metaball.scale.set(16, 9, 4);

scene.add(metaball);

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
/*composer.addPass(
    new UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), 1.3, 0.5, 0.2)
);*/

const clock = new THREE.Clock();
function animate() {
    const elapsed = clock.getElapsedTime();
    metaball.reset();

const t = elapsed;

metaball.reset();

metaball.addBall(
    0.5135 + Math.sin(t) * 0.515,
    0.5,// + Math.sin(t) * 0.15,
    0.5,
    0.5,
    20,
    5
);

metaball.addBall(
    0.5135 + Math.cos(t * 1.3) * 0.415,
    0.5,
    0.5,
    0.5,
    20,
    5
);

metaball.addBall(
    0.5,
    0.5 + Math.sin(t * 0.8) * 0.415,
    0.5,
    0.5,
    12
);

metaball.addBall(
    0.5,
    0.5,
    0.5 + Math.sin(t * 0.8) * 0.34,
    0.5,
    12
);

metaball.update();
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
