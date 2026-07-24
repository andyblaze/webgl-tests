import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { mt_rand } from "./functions.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { RectAreaLightHelper } from "three/addons/helpers/RectAreaLightHelper.js";


const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(innerWidth, innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputColorSpace = THREE.SRGBColorSpace;
document.body.appendChild(renderer.domElement);


const scene = new THREE.Scene();
scene.background = new THREE.Color(0x050505);
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

scene.add(new THREE.AmbientLight(0xffffff, 2));

const key = new THREE.DirectionalLight(0xffffff, 2);
key.position.set(4, 5, 6);
scene.add(key);

const fill = new THREE.DirectionalLight(0x88aaff, 0.6);
fill.position.set(-5, -2, 3);
scene.add(fill);

const areaLight = new THREE.RectAreaLight(
    0xffffff,
    4,
    8,
    8
);

areaLight.position.set(0, 3, 2);
areaLight.lookAt(0,0,-8);

const rimLight = new THREE.DirectionalLight(
    0x6688ff,
    2
);

rimLight.position.set(
    -5,
    5,
    -5
);



scene.add(areaLight);

const loader = new THREE.TextureLoader();

const canvasTexture = loader.load("canvas.png");
const normalTexture = loader.load("normal.png");

const cube = new THREE.Mesh(
    new RoundedBoxGeometry(4,4,4, 6, 0.08),
    new THREE.MeshPhysicalMaterial({

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
        normalScale: new THREE.Vector2(0.15, 0.15)

    })
);
cube.position.set(0,0,-8);
scene.add(cube);
rimLight.lookAt(cube.position);

scene.add(rimLight);

const geometry = new RoundedBoxGeometry(
    4.05,
    4.05,
    4.05,
    6,
    0.08
);

const shell = new THREE.Mesh(
    geometry,//new THREE.BoxGeometry(4.05,4.05,4.05),
    new THREE.MeshBasicMaterial({
        color:0xffffff,
        transparent:true,
        opacity:0.05,
        ior: 1.5
    })
);

shell.position.copy(cube.position);
scene.add(shell);

/*const grp = new THREE.Group();
grp.add(cube, shell);
grp.position.set(0,0,-8);*/

const sphereCount = 100;

const sphereGeometry = new THREE.SphereGeometry(
    0.125,
    32,
    32
);

const sphereMaterial = new THREE.MeshStandardMaterial({
    color: 0xff2244,
    roughness: 0.25,
    metalness: 0.1
});

const spheres = [];

const cubeBounds = {
    x: 2,
    y: 2,
    zFront: -6,   // front face of cube
    zBack: -10
};

const sphereRadius = 0.125;


for (let i = 0; i < sphereCount; i++) {

    const sphere = new THREE.Mesh(
        sphereGeometry,
        sphereMaterial.clone()
    );

    sphere.position.set(
        THREE.MathUtils.randFloat(-6, 6),
        THREE.MathUtils.randFloat(-3, 3),
        THREE.MathUtils.randFloat(-2, -12)
    );


    // if sphere would intersect cube volume, move it in front
    const intersectsCube =
        Math.abs(sphere.position.x) < cubeBounds.x + sphereRadius &&
        Math.abs(sphere.position.y) < cubeBounds.y + sphereRadius &&
        sphere.position.z < cubeBounds.zFront + sphereRadius &&
        sphere.position.z > cubeBounds.zBack - sphereRadius;


    if (intersectsCube) {
        sphere.position.z = cubeBounds.zFront + sphereRadius + 0.5;
    }


    sphere.material.color.setHSL(
        Math.random(),
        0.8,
        0.5
    );

    scene.add(sphere);
    spheres.push(sphere);
}

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
/*composer.addPass(
    new UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), 1.3, 0.5, 0.2)
);*/

const clock = new THREE.Clock();

function animate(){

    const elapsed = clock.getElapsedTime();

spheres.forEach((sphere, i) => {

    const t = elapsed * 0.5 + i;

    sphere.position.y += Math.sin(t) * 0.002;
    sphere.rotation.x += 0.01;
    sphere.rotation.y += 0.01;

});

cube.rotation.x = elapsed * 0.07;
cube.rotation.y = elapsed * 0.09;
cube.rotation.z = elapsed * 0.08;
shell.rotation.x = elapsed * 0.07;
shell.rotation.y = elapsed * 0.09;
shell.rotation.z = elapsed * 0.08;


// capture environment from cube position
cube.visible = false;

cubeCamera.position.copy(cube.position);
cubeCamera.update(renderer, scene);

cube.visible = true;


composer.render();

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
