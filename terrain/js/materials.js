export default class Materials {
    constructor(three) {
        this.three = three;
        this.loader = new three.TextureLoader();
        this.data = {
            "green": {
                color: 0x493925, transmission: 0.2,
                roughness: 1, metalness: 0,
                emissive: 0x493925, emissiveIntensity: 0.12,
                sheenColor: 0x493925, sheen: 0.18,
                side: three.DoubleSide,
                normalScale: new three.Vector2(2, 2),
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
