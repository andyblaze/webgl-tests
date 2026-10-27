import ThreeObj from "../three/three-obj.js";
import { Water } from "../examples/jsm/objects/Water.js";

export default class waterPlane extends ThreeObj {
    constructor(three, geo, mat) {
        super();
        this.threeObj = new Water(new three.PlaneGeometry(128, 64, 128, 128), {
            textureWidth: 1024,
            textureHeight: 1024,
            waterNormals: new THREE.TextureLoader().load('../textures/pave-normal.png', function (texture) {
                texture.wrapS = texture.wrapT = three.RepeatWrapping;
            }),
            //sunDirection: new THREE.Vector3(0, 1, 125),
            sunColor: "#f53e22",
            waterColor: "#000000",
            distortionScale: 20,
            //alpha: 0.5,
            scale: 3,
            flowDirection: new three.Vector2(1, 1),
            reflectivity: 1
        });
    }
}
/*
const water = new Water(new THREE.PlaneGeometry(128, 64, 128, 128), {
    textureWidth: 1024,
    textureHeight: 1024,
    waterNormals: new THREE.TextureLoader().load('textures/pave-normal.png', function (texture) {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    }),
    //sunDirection: new THREE.Vector3(0, 1, 125),
    sunColor: "#f53e22",
    waterColor: "#000000",
    distortionScale: 20,
    //alpha: 0.5,
    scale: 3,
    flowDirection: new THREE.Vector2(1, 1),
    reflectivity: 1
});*/
