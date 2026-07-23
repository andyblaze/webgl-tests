import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { mt_rand } from "./functions.js";
import Orb from "./orb.js";

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(innerWidth, innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputColorSpace = THREE.SRGBColorSpace;
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 100);
camera.position.set(0, 1.5, 8);

new OrbitControls(camera, renderer.domElement);

scene.add(new THREE.AmbientLight(0xffffff, 2));

const dl = new THREE.DirectionalLight(0xc6c6c6, 1);
dl.position.set(0, -18, 12);
scene.add(dl);

for ( let i = 0; i < 300; i++ ) {
    const sp = new THREE.Mesh(
        new THREE.SphereGeometry(0.02),
        new THREE.MeshBasicMaterial({color: 0xffffff})
    );
    sp.position.set(
        mt_rand(-20, 20),
        mt_rand(-10, 10),
        mt_rand(-14, 30)
    );
    scene.add(sp);
}

const orbs = [
    new Orb(THREE, -4, 0x66ccff),
    new Orb(THREE, 0, 0x00ff00),
    new Orb(THREE, 4, 0xff88dd)
];
orbs.forEach((o)=>{ o.addToScene(scene)});

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
composer.addPass(
    new UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), 1.3, 0.5, 0.2)
);

const clock = new THREE.Clock();
function animate() {
    const elapsed = clock.getElapsedTime();
    orbs.forEach((o, i)=>{
        o.update(elapsed, i);
    });
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
