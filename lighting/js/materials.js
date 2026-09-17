export default class Materials {
    constructor(three) {
        this.loader = new three.TextureLoader();
        this.data = {
            floor: { 
                color: 0xffffff, side: three.DoubleSide,
                metalness:0.15, roughness: 0.85,
                emissive:0xff0000, emissiveIntensity: 0.1,
                clearcoat: 1, clearcoatRoughness: 0.5,
                anisotropy: 0.25,
                normalMap: this.loader.load("textures/brush-normal.png"),
                map: this.loader.load("bw.jpg")
            },
            iceWorld: {
                color: 0x00ffff,
                roughness: 0.9, metalness: 0.1,
                clearcoat: 0.25, clearcoatRoughness: 0.5,
                emissive: 0x0080ff, emissiveIntensity: 0.75,
                sheenColor: 0xf471c7, sheen: 0.25,
                anisotropy: 1,
                //normalMap: this.loader.load("textures/pave-normal.png"),
                map: this.loader.load("textures/pave.png")
            }
        };
    }
    get(name) {
        return this.data[name];
    }
}
