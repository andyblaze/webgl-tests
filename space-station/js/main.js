import * as THREE from "./three.module.js";
import Mind from "./mind.js";
import Ship from "./ship.js";
import Planet from "./planet.js";
import SkyDome from "./sky.js";
import StarsDecor from "./stars.js";
import Sun from "./sun.js";
import { degToRad } from "./functions.js";

const scene = new THREE.Scene();

const renderer = new THREE.WebGLRenderer({
    antialias:true
});

renderer.setSize(window.innerWidth,window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

document.body.appendChild(renderer.domElement);

// Lighting
scene.add(new THREE.HemisphereLight(0x99bbff, 0x222222, 1.2));

const sun1 = new THREE.DirectionalLight(0xffffff, 0.7);
sun1.position.set(-9, 4, -21);//5, 10, 4);
scene.add(sun1);
const sun2 = new THREE.DirectionalLight(0xffffff, 1.6);
sun2.position.set(-9, 4, 21);//5, 10, 4);
scene.add(sun2);

const sunVisual = new Sun(THREE);
sunVisual.addToScene(scene);

renderer.setClearColor(0x0b1022);

const sky = new SkyDome(THREE, new StarsDecor(THREE, 2000));
sky.addToScene(scene);

class Satellite5 {
    constructor(three) {
        this.group = new three.Group();
        this.group.position.x = 180;
        this.group.position.y = 10;
        this.group.position.z = -400;
        this.group.rotation.x = degToRad(-22);
        this.group.rotation.z = degToRad(-22);
        this.texLoader = new three.TextureLoader();
        this.cylinder = this.makeCylinder(three);
        this.ring1 = this.makeRing(three, 100, 90);
        this.ring2 = this.makeRing(three, 0, 90);
        this.ring3 = this.makeRing(three, -100, 90);
        this.group.add(this.cylinder);
        this.group.add(this.ring1);
        this.group.add(this.ring2);
        this.group.add(this.ring3);
    }
    makeTexture(three, filename, repeatX=1) {
        const texture = this.texLoader.load(
            filename,
            (tex) => {
                tex.repeatX = repeatX;
                //tex.repeatY = repeatX;
                tex.wrapS = three.RepeatWrapping;
                tex.wrapT = three.ClampToEdgeWrapping;
                tex.needsUpdate = true;
            }
        );
        return texture;
    }
    makeRing(three, pos, rot) {
        const geometry = new three.TorusGeometry( 80, 10, 16, 100 );
        const norm = this.makeTexture(three, "norm-ring.png", 6);
        const bump = this.makeTexture(three, "ring.png", 6);

        const material = new three.MeshStandardMaterial({ 
            color: 0x42352F,
            roughness: 0.5,
            bumpMap: bump,
            normalMap: norm,
            bumpScale: 2,
            metalness: 0.5
        });

        const torus = new three.Mesh( geometry, material ); 
        const truss = new three.Mesh(
            new three.CylinderGeometry(4, 4, 180, 32),
            material
        );
        const g = new three.Group();
        g.add(torus);
        g.add(truss);
        g.rotation.x = degToRad(rot);
        g.position.y = pos;
        return g;       
    }
    makeCylinder(three) {
        const norm = this.makeTexture(three, "norm-brick2.png");
        const bump = this.makeTexture(three, "brick2.png");

        const material = new three.MeshStandardMaterial({ 
            color: 0x42352F,
            roughness: 0.5,
            bumpMap: bump,
            normalMap: norm,
            bumpScale: 2,
            metalness: 0.5
        });
        return new three.Mesh(
            new three.CylinderGeometry(20, 20, 280, 32),
            material
        );
    }
    addToScene(scene) {
        scene.add(this.group);
    }
    update() {
        this.cylinder.rotation.y -= 0.002;
        this.ring1.rotation.z += 0.002;
        this.ring2.rotation.z -= 0.002;
        this.ring3.rotation.z += 0.002;
    }
}

const satellite = new Satellite5(THREE);
satellite.addToScene(scene);


const planet = new Planet(THREE);
planet.addToScene(scene);

const ship = new Ship(THREE, new Mind());
const cam = ship.camera;

const clock = new THREE.Clock();

function animate(timestamp) {    
    const dt = clock.getDelta(); 
    const elapsedTime = clock.getElapsedTime();

    sunVisual.update(dt);
    // Keep the grid centred on the camera
    planet.update(cam);
    //
    // Keep the sky centred on the camera
    //
    sky.copyPosition(cam.position);
    sky.update();

    ship.update(dt);
    satellite.update();

    renderer.render(scene, cam);
    requestAnimationFrame(animate);
}

animate(performance.now());

//
// Resize
//

window.addEventListener("resize",()=>{
    cam.aspect = window.innerWidth / window.innerHeight;
    cam.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);

});