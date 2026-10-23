export default class Presets {
    constructor(three) {
        this.three = three;
        this.loader = new three.TextureLoader();
        const roughnessMap = this.loader.load("maps/tile-frosty-glass.png");
        roughnessMap.wrapS = three.RepeatWrapping;
        roughnessMap.wrapT = three.RepeatWrapping;
        roughnessMap.repeat.set(2, 2);
        roughnessMap.offset.set(0, 1);
        const normalMap = this.loader.load("maps/tile-terrace.png");

        this.p1 = {
            color: 0xffffff,
            //transparent: true,
            //opacity: 0.8,
            metalness: 1,
            roughness: 0.9,
            //transmission: 0.25,
            clearcoat: 1,
            clearcoatRoughness: 0.75,
            //thickness: 0.8,
            //ior: 1,
            emissiveIntensity: 0.5,
            emissive: 0x0080ff,
            //anisotropy: 0.125,
            //attenuationColor: 0x00ffff,
            roughnessMap,
            //normalMap,
            normalScale: new three.Vector2(1, 1)
        };
    }
    material(key) {
        return this[key];
    }
}
