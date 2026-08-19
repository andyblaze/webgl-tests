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
        }
    }
}