import { FontLoader } from "../three/addons/loaders/FontLoader.js";
import { TextGeometry } from "../three/addons/geometries/TextGeometry.js";
import ThreeGroup from "../three/three-group.js";

export default class Text extends ThreeGroup {
    constructor(three, geo, mat) {
        super(three);
        this.three = three;
        this.geo = {...geo};
        this.material = new this.three.MeshPhysicalMaterial(mat);
        this.text = "Test";
        this.fontPath = "./js/examples/fonts/";
        this.fontFile = "helvetiker_regular.typeface.json";
        this.font = this.fontPath + this.fontFile;
        geo["font"] = this.font;
        this.loadFont();
    }
    loadFont() {
        this.clear();
        const loader = new FontLoader();
        loader.load(
            this.font,
            (font) => {
                this.geo["font"] = font;
                this.geometry = new TextGeometry(this.text, this.geo);                
                const mesh = new this.three.Mesh(this.geometry, this.material);
                this.threeObj.add(mesh);
            }
        );
    }
    clear() {
        // Remove existing text geometry 
        const old = this.threeObj.children[0];
        if ( old )
            old.geometry.dispose();
        this.threeObj.clear(); 
    }
    setFont(file) {
        this.fontFile = file; 
        this.font = this.fontPath + this.fontFile; 
        this.loadFont(); 
        return this; 
    } 
    setText(text) { 
        this.text = text;
        this.loadFont(); 
        return this; 
    }
}