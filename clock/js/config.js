import { degToRad } from "./functions.js";

export default class Config {
    constructor(three) {
        this.loader = new three.TextureLoader();
        this.brushedBrass = {
            color: 0xffffff,
            metalness: 0.56,
            roughness: 0.28,
            //emissive: 0xcaa40b,
            //emissiveIntensity: 0.25,
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

        this.toothWidth = 0.32;
        this.toothDepth = 0.35;
        this.toothPitch = 0.6602253311059799;

        this.bushes = {
            flywheel: {
                data: { bushRadius: 3.8, bushThickness: 0.5 }
            }
        };

        this.hands = {
            second: {
                data: { handLength: 5, handThickness: 0.25, 
                    handWidth: 0.25, counterWeight: 0.8 
                }
            }
        };

        this.gears = {
            flywheelCog: {
                data: { inner: 1, teeth: 12, direction: -1, rpm: 1 },
                rotationY: degToRad(0)
            },
            flywheelGear: {
                data: { inner: 1, teeth: 30 },
                rotationY: degToRad(0)
            },
            gear2: {
                data: { inner: 1, teeth: 36 },
                rotationY: degToRad(3.8)
            },
            gear3: {
                data: { inner: 1, teeth: 15 },
                rotationY: degToRad(18)
            },
            gear4: {
                data: { inner: 1, teeth: 48 },
                rotationY: degToRad(2)
            }
        };
        this.shafts = {
            flywheelShaft: {
                position: new three.Vector3(7, 0, 0),
                radius: 0.25, 
                length: 8
            },
            shaft2: {
                position: new three.Vector3(1.55, 0, 0),
                radius: 0.25, 
                length: 8
            },
            shaft3: {
                position: new three.Vector3(8.75, 4.7, 1.15),
                radius: 0.25, 
                length: 8
            },
            shaft4: {
                position: new three.Vector3(-9, 3.45, 0),
                radius: 0.25, 
                length: 8
            }
        };
    }
    
}