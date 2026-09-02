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
            minute: {
                data: { handLength: 9, handThickness: 0.25, 
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
            minTrainGear1: {
                data: { inner: 1, teeth: 36 },
                rotationY: degToRad(0)
            },
            minTrainGear2: {
                data: { inner: 1, teeth: 12 },
                rotationY: degToRad(0)
            },
            minTrainGear3: {
                data: { inner: 1, teeth: 24 },
                rotationY: degToRad(0)
            },
            minTrainGear4: {
                data: { inner: 1, teeth: 12 },
                rotationY: degToRad(0)
            },
            minTrainGear5: {
                data: { inner: 1, teeth: 24 },
                rotationY: degToRad(0)
            },
            minTrainGear6: {
                data: { inner: 1, teeth: 12 },
                rotationY: degToRad(0)
            },
            minTrainGear7: {
                data: { inner: 1, teeth: 24 },
                rotationY: degToRad(0)
            },
            minTrainGear8: {
                data: { inner: 1, teeth: 12 },
                rotationY: degToRad(0)
            },
            minTrainGear9: {
                data: { inner: 1, teeth: 30 },
                rotationY: degToRad(6)
            }
        };
        this.shafts = {
            flywheelShaft: {
                position: new three.Vector3(0, 0, 0),
                radius: 0.25, 
                length: 8
            },
            minTrainShaft1: {
                position: new three.Vector3(-5.45, 0, 0),
                radius: 0.25, 
                length: 8
            },
            minTrainShaft2: {
                position: new three.Vector3(-10.15, 0.7, 1.15),
                radius: 0.25, 
                length: 8
            },
            minTrainShaft3: {
                position: new three.Vector3(-10, -3.35, 0),
                radius: 0.25, 
                length: 8
            },
            minTrainShaft4: {
                position: new three.Vector3(-6.25, -5.35, 0),
                radius: 0.25, 
                length: 8
            },
            minTrainShaft5: {
                position: new three.Vector3(-1.5, -5.35, 0),
                radius: 0.25, 
                length: 8
            }
        };
    }
    
}