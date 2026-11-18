export default class Materials {
    constructor(three) {
        this.three = three;
        this.loader = new three.TextureLoader();
        this.data = {
            "brown": {
                color: 0x493925, transmission: 0.2,
                roughness: 1, metalness: 1,
                emissive: 0x493925, emissiveIntensity: 0.2,
                sheenColor: 0x493925, sheen: 0.2,
                clearcoat: 1, clearcoatRoughness: 0.25, 
                anisotropy: 0.75,
                side: three.DoubleSide,
                roughnessMap: this.getMap("rocky.png", 2),
                normalScale: new three.Vector2(1.4, 1.4),
                normalMap: this.getMap("rocky-normal.png", 2)
            },
            "cyan": {
                color: 0x009999, transmission: 0.2,
                roughness: 1, metalness: 1,
                emissive: 0x009999, emissiveIntensity: 0.2,
                sheenColor: 0x009999, sheen: 0.2,
                anisotropy: 1,
                side: three.DoubleSide,
                roughnessMap: this.getMap("rocky-normal.png", 1),
                normalScale: new three.Vector2(0.4, 0.4),
                normalMap: this.getMap("rocky-normal.png", 8)
            }
        };
    }
    getMap(map, repeat=0) {
        const texmap = this.loader.load(map);
        if ( repeat > 1 ) {
            texmap.wrapS = this.three.RepeatWrapping;
            texmap.wrapT = this.three.RepeatWrapping;
            texmap.repeat.set(repeat, repeat);
        }
        return texmap;
    }
    getMat(key) {
        return this.data[key];
    }
}
