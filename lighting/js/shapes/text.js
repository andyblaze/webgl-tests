import { FontLoader } from "../three/addons/loaders/FontLoader.js";
import { TextGeometry } from "../three/addons/geometries/TextGeometry.js";
import ThreeGroup from "../three/three-group.js";

export default class Text extends ThreeGroup {
    constructor(three, geo, mat) {
        super(three);
        this.three = three;
        this.geo = geo;
        this.mat = mat;
        this.text = "Test";
        this.fontPath = "./js/examples/fonts/";
        this.fontFile = "helvetiker_regular.typeface.json";
        this.font = this.fontPath + this.fontFile;
        geo["font"] = this.font;
        this.loadFont();
    }
    loadFont() {
        const loader = new FontLoader();
        loader.load(
            this.font,
            (font) => {
                this.geo["font"] = font;
                this.geometry = new TextGeometry(this.text, this.geo);
                this.material = new this.three.MeshPhysicalMaterial(this.mat);
                const mesh = new this.three.Mesh(this.geometry, this.material);
                this.threeObj.add(mesh);
            }
        );
    }
    setFont(file) {
        this.fontFile = file; 
        this.font = this.fontPath + this.fontFile;
        // Remove existing text geometry 
        this.threeObj.clear(); 
        this.loadFont(); 
        return this; 
    } 
    setText(text) { 
        this.text = text; 
        this.threeObj.clear(); 
        this.loadFont(); 
        return this; 
    }
}