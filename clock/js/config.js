import { degToRad } from "./functions.js";

export default class Config {
    constructor(three) {
        this.loader = new three.TextureLoader();
        this.brushedBrass = {
            color: 0xeedd11,
            metalness: 0.56,
            roughness: 0.28,
            emissive: 0xcaa40b,
            emissiveIntensity: 0.25,
            normalMap: this.loader.load("./textures/brush-normal.png"),
            normalScale: new three.Vector2(0.21, 0.21),
            roughnessMap: this.loader.load("./textures/marble.png")
        };
        this.brushedSteel = {
            color: 0x858778,
            metalness: 0.56,
            roughness: 0.28,
            emissive: 0xc0c0c0,
            emissiveIntensity: 0.25,
            normalMap: this.loader.load("./textures/brush-normal.png"),
            normalScale: new three.Vector2(0.21, 0.21),
            roughnessMap: this.loader.load("./textures/marble.png")
        };
        this.redBrass = {
            color: 0xee0011,
            metalness: 0.56,
            roughness: 0.28,
            emissive: 0xca540b,
            emissiveIntensity: 0.25,
            normalMap: this.loader.load("./textures/brush-normal.png"),
            normalScale: new three.Vector2(0.21, 0.21),
            roughnessMap: this.loader.load("./textures/marble.png")
        };
        this.gears = {
            gear1: {
                data: { inner: 1, spokes: 5, teeth: 48, direction: -1, rpm: 1 },
                position: new three.Vector3(7, 0, 0),
                rotationY: degToRad(0)
            },
            gear2: {
                data: { inner: 1, spokes: 3, teeth: 24 },
                position: new three.Vector3(-0.6, 2, 0),
                rotationY: degToRad(7.25)
            },
            gear3: {
                data: { inner: 1, spokes: 4, teeth: 36 },
                position: new three.Vector3(-5.75, -2.15, 0),
                rotationY: degToRad(5)
            },
            gear4: {
                data: { inner: 1, spokes: 2, teeth: 12 },
                position: new three.Vector3(-10.7, -0.1, 0),
                rotationY: degToRad(2)
            }
        };
    }
    
}