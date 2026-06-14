import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.165.0/build/three.module.js";
import Field from "./field.js";
import Mesh from "./mesh.js";
import GravityWell from "./gravity-well.js";
import DeltaReport from "./delta-report.js";

function makeCamera(three, cfg, pos, look) {
    const camera = new three.PerspectiveCamera(
        cfg.fov,
        cfg.aspect,
        cfg.near,
        cfg.far
    );

    camera.position.set(pos.x, pos.y, pos.z);
    camera.lookAt(look.x, look.y, look.z);    
    return camera;
}

function makeRenderer(three) {
    const renderer = new three.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    return renderer;
}

function makePlane(three, meshSize, img) {
    const texture = new three.TextureLoader().load(img);
    texture.minFilter = three.LinearMipmapLinearFilter;
    texture.magFilter = three.LinearFilter;
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    const plane = new three.Mesh(
        new three.PlaneGeometry(
            meshSize * 1.4,   // width
            meshSize * 1.4,   // height
            meshSize,   // width segments
            meshSize    // height segments
        ),
        new three.MeshBasicMaterial({
            map: texture
        })
    );
    // Make it horizontal
    plane.rotation.x = -Math.PI / 2;
    return plane;
}

function makeWells(nWells) {
    const wells = [];
    for ( let i = 0; i < nWells; i++ )
        wells.push(new GravityWell());   
    return wells; 
}

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = makeCamera(
    THREE, 
    {fov: 22, aspect: window.innerWidth / window.innerHeight, near: 0.1, far: 1000 },
    {x: 0, y: 160, z: 160}, 
    {x: 0, y: 0, z: 0}
);
const renderer = makeRenderer(THREE);
document.body.appendChild(renderer.domElement);

const plane = makePlane(THREE, 160, "oce.jpg?g="+Math.random());
scene.add(plane);

const wells = makeWells(28);
const field = new Field(wells);

const positions = plane.geometry.attributes.position;
const mesh = new Mesh(positions);

function animate(timestamp) {
    field.update(timestamp);
    mesh.update(timestamp, field);
    renderer.render(scene, camera);
    DeltaReport.log(timestamp);
    requestAnimationFrame(animate);
}

animate(performance.now());

window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});