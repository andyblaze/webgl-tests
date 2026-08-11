export default class TextureLoader {
    constructor(three) {
        this.loader = new three.TextureLoader();
    }
    load(tex) {
        return this.loader.load(tex);
    }
}
