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
        this.normalScale = [2, 2]
    }
}
