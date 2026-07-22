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
        const cfg = {
            length: 280,
            trussSize: 4,
            ringCount: 3,
            ringStart: 100,
            ringSeparation: 100,
            ringRadius: 80,
            ringTilt: 90,
            cylinderLength: 100,
            cylinderRadius: 20,
            pos: { x: 180, y: 10, z: -400 },
            tilt: { x: -22, y: 0, z: -22 },
        };
        this.group = new three.Group();
        this.group.position.x = cfg.pos.x;
        this.group.position.y = cfg.pos.y;
        this.group.position.z = cfg.pos.z;
        this.group.rotation.x = degToRad(cfg.tilt.x);
        this.group.rotation.z = degToRad(cfg.tilt.z);
        this.texLoader = new three.TextureLoader();
        this.spine = this.makeSpine(three, cfg.length);
        const cylinderCount = cfg.ringCount + 1;
        let cyTop = 140;//(cfg.length / 2);
        let cyLen = 36;//80 - (cfg.trussSize * 1);//(cfg.length - (cfg.ringSeparation * 2) / 2) - cfg.trussSize;
        this.cylinder0 = this.makeCylinder(three, cfg.cylinderRadius, cyLen, cyTop);
        console.log(cyTop, cyLen);
        cyLen = 92;
        cyTop = 96;//-= (cfg.trussSize + cyLen);
        this.cylinder1 = this.makeCylinder(three, cfg.cylinderRadius, cyLen, cyTop);
        cyTop = -4;//-= (cfg.trussSize + cyLen);
        this.cylinder2 = this.makeCylinder(three, cfg.cylinderRadius, cyLen, cyTop);
        cyLen = 36;
        cyTop = -104;//-= (cfg.trussSize + cyLen);
        this.cylinder3 = this.makeCylinder(three, cfg.cylinderRadius, cyLen, cyTop);
        this.makeRings(three, cfg);
        /*let t = 1;
        for ( let i = 1; i <= cfg.ringCount; i++ ) {
            const p = t * cfg.ringSeparation;
            const idx = "ring" + i;
            this[idx] = this.makeRing(three, p, cfg.ringTilt, cfg.ringRadius);
            this.group.add(this[idx]);
            t--;
        }*/
        this.group.add(this.spine);
        this.group.add(this.cylinder0);
        this.group.add(this.cylinder1);
        this.group.add(this.cylinder2);
        this.group.add(this.cylinder3);
        //this.group.add(this.ring1);
        //this.group.add(this.ring2);
        //this.group.add(this.ring3);
    }
    makeRings(three, cfg) {
        let t = 1;
        for ( let i = 1; i <= cfg.ringCount; i++ ) {
            const p = t * cfg.ringSeparation; console.log(p);
            const idx = "ring" + i;
            this[idx] = this.makeRing(three, p, cfg.ringTilt, cfg.ringRadius);
            this.group.add(this[idx]);
            t--;
        }       
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
    makeRing(three, pos, rot, radius) {
        //const geometry = ;
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

        const torus = new three.Mesh( 
            new three.TorusGeometry( radius, 10, 16, 100 ),
            material 
        );
        const truss = new three.Mesh(
            new three.CylinderGeometry(4, 4, radius * 2, 32),
            material
        );
        const g = new three.Group();
        g.add(torus);
        g.add(truss);
        g.rotation.x = degToRad(rot);
        g.position.y = pos;
        return g;       
    }
    makeSpine(three, length) {
        const material = new three.MeshStandardMaterial({ 
            color: 0x000000,
            roughness: 0.5,
            metalness: 0.5
        });
        return new three.Mesh(
            new three.CylinderGeometry(10, 10, length, 32),
            material
        );
    }
    makeCylinder(three, radius, length, pos) {
        const norm = this.makeTexture(three, "norm-brick.png");
        const bump = this.makeTexture(three, "brick.png");

        const material = new three.MeshStandardMaterial({ 
            color: 0x42352F,
            roughness: 0.5,
            bumpMap: bump,
            normalMap: norm,
            bumpScale: 2,
            metalness: 0.5
        });
        const c = new three.Mesh(
            new three.CylinderGeometry(radius, radius, length, 32),
            material
        );
        c.position.y = pos - (length / 2);
        return c;
    }
    addToScene(scene) {
        scene.add(this.group);
    }
    update() {
        this.cylinder0.rotation.y -= 0.002;
        this.cylinder1.rotation.y -= 0.002;
        this.cylinder2.rotation.y -= 0.002;
        this.cylinder3.rotation.y -= 0.002;
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