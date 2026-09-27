export default class Materials {
    constructor(three, dataClass) {
        this.loader = new three.TextureLoader();
        this.three = three;
        this.loadedTextures = {};
        this.data = dataClass.data;
    }
    loadTexture(path) {
        if ( !this.loadedTextures[path] ) {
            this.loadedTextures[path] = this.prepareTexture(this.loader.load(path));
        }
        return this.loadedTextures[path];
    }
    prepareTexture(texture, repeat = 8) {
        texture.wrapS = this.three.RepeatWrapping;
        texture.wrapT = this.three.RepeatWrapping;
        texture.repeat.set(repeat, repeat);

        return texture;
    }
    get(name) {
        const mat = {...this.data[name]};
        if ( mat.map )
            mat.map = this.loadTexture(mat.map);
        if ( mat.normalMap )
            mat.normalMap = this.loadTexture(mat.normalMap);
        return mat;
    }
}
