export default class Materials {
    constructor(three, dataClass) {
        this.loader = new three.TextureLoader();
        this.three = three;
        this.loadedTextures = {};
        this.data = dataClass.data;
    }
    loadTexture(map) {
        if ( !this.loadedTextures[map.tex] ) {
            this.loadedTextures[map.tex] = this.prepareTexture(this.loader.load(map.tex), map.repeat);
        }
        return this.loadedTextures[map.tex];
    }
    prepareTexture(texture, repeat) {
        texture.wrapS = this.three.RepeatWrapping;
        texture.wrapT = this.three.RepeatWrapping;
        texture.repeat.set(repeat, repeat);
        return texture;
    }
    prepMap(matKey, map) {
        const result = {};
        result[matKey] = this.loadTexture(map);
        for ( const [key, val] of Object.entries(map) ) {
            if ( key === "repeat" || key === "tex" )
                continue;
            result[key] = val;
        }
        return result;
    }
    get(name) {
        let mat = {...this.data[name]};
        for ( const [key, val] of Object.entries(mat) ) {
            if (val?.tex) { // a map of some sort
                const data = this.prepMap(key, val);
                mat = {...mat, ...data};
            }
        }
        return mat;
    }
}
