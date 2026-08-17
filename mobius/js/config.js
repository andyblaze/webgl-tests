export default class Config {
    constructor(three) {
        this.geometry = { 
            radius: 1.25, width: 0.35, thickness: 0.06, 
            segmentsU: 256, segmentsV: 64 
        },
        this.material = {
            vertexColors: true,
            side: three.DoubleSide,
            color: 0x40FFFF,
            roughness: 0.75,
            metalness: 0.5,
            emissive:0x1EDCDA,
            emissiveIntensity:0.5,
            clearcoat: 1,
            clearcoatRoughness: 0.5,
            anisotropy: 1
        },
        this.maps = {
            normalTex: "./textures/brush-normal.png",
            roughTex: "./textures/marble.png"
        },
        this.normalScale = [2, 2],
        this.lights = {
            hemi: {
                start: 0xffffff, stop: 0x444444, 
                strength: 0.6,
                position: new three.Vector3(0, 2, 0)
            },
            red: {
                color: 0xFF00FF, strength: 3,
                position: new three.Vector3(2, 3, 8)
            },
            green: {
                color: 0x8080FF, strength: 6,
                position: new three.Vector3(5, 0, 0)
            },
            blue: {
                color: 0xB2FF43, strength: 3,
                position: new three.Vector3(-4, -4, -6)
            }
        }
    }
}
