export default class Materials {
    constructor(three) {
        this.loader = new three.TextureLoader();
        this.three = three;
        this.data = {
            floor: { 
                color: 0xffffff, side: three.DoubleSide,
                metalness:0.15, roughness: 0.85,
                emissive:0xff0000, emissiveIntensity: 0.1,
                clearcoat: 1, clearcoatRoughness: 0.5,
                anisotropy: 0.25,
                normalMap: "textures/brush-normal.png",
                map: "textures/tiles.jpg"
            },
            iceWorld: {
                color: 0x00ffff,
                roughness: 0.5, metalness: 0.5,
                //clearcoat: 0.75, clearcoatRoughness: 0.5,
                emissive: 0x0080ff, emissiveIntensity: 0.25,
                sheenColor: 0xf471c7, sheen: 1//,
                //anisotropy: 1//,
                //normalMap: this.loader.load("textures/pave-normal.png"),
                //map: "textures/pave.png"
            },
            fireWorld: {
                color: 0xff0000,
                roughness: 0.5, metalness: 0.5,
                clearcoat: 0.75, clearcoatRoughness: 0.5,
                emissive: 0x990000, emissiveIntensity: 0.5,
                sheenColor: 0xf41137, sheen: 1,
                anisotropy: 1,
                //normalMap: this.loader.load("textures/pave-normal.png"),
                map: "textures/pave.png"
            },
            greenWorld: {
                color: 0x00ff00,
                roughness: 0.5, metalness: 0.5,
                clearcoat: 0.75, clearcoatRoughness: 0.5,
                emissive: 0x009900, emissiveIntensity: 0.5,
                sheenColor: 0x11f437, sheen: 1,
                anisotropy: 1,
                //normalMap: "textures/pave-normal.png",
                map: "textures/pave.png"
            },
            brushedBrass: {
                color: 0xd2c628,
                roughness: 0.7, metalness: 0.3,
                clearcoat: 0.75, clearcoatRoughness: 0.25,
                emissive: 0xe0b347, emissiveIntensity: 0.5,
                sheenColor: 0xc5e21d, sheen: 0.2,
                anisotropy: 0,
                normalMap: "textures/marble-normal.png",
                map: "textures/brush.png"
            },
            pinkMetal: {
                color: 0xff0080,
                roughness: 0.5, metalness: 0.5,
                clearcoat: 1, clearcoatRoughness: 0.5,
                emissive: 0x9516e9, emissiveIntensity: 0.25,
                sheenColor: 0xff66ff, sheen: 0.68,
                anisotropy: 0,
                attenuationColor: 0xf80762,
                //normalMap: "textures/pebbles-normal.png",
                //normalScale: 1,
                map: "textures/pebbles.png"
            },
            brushedMetal: {
                color: 0xbcbcbc,
                roughness: 0.5, metalness: 0.4,
                clearcoat: 1, clearcoatRoughness: 0.5,
                emissive: 0xc0c0c0, emissiveIntensity: 0.25,
                sheenColor: 0xc0c0c0, sheen: 1,
                anisotropy: 1,
                attenuationColor: 0xf80762,
                normalMap: "textures/brush-normal.png",
                normalScale: new three.Vector2(2, 2)//[1, 1],
                //map: "textures/brush.png"
            }
        };
    }
    prepareTexture(texture, repeat = 8) {
        texture.wrapS = this.three.RepeatWrapping;
        texture.wrapT = this.three.RepeatWrapping;
        texture.repeat.set(repeat, repeat);

        return texture;
    }
    get(name) {
        const mat = this.data[name];
        if ( mat.map )
            mat.map = this.prepareTexture(this.loader.load(mat.map));
        if ( mat.normalMap )
            mat.normalMap = this.prepareTexture(this.loader.load(mat.normalMap));
        return mat;
    }
}
