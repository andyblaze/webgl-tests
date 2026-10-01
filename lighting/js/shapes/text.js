import { FontLoader } from "../three/addons/loaders/FontLoader.js";
import { TextGeometry } from "../three/addons/geometries/TextGeometry.js";
import ThreeGroup from "../three/three-group.js";

export default class Text extends ThreeGroup {
    constructor(three, geo, mat) {
        super(three);
        this.fontPath = "./js/examples/fonts/";
        this.fontFile = "helvetiker_regular.typeface.json";
        this.font = this.fontPath + this.fontFile;
        geo["font"] = this.font;
        const loader = new FontLoader();
        loader.load(
            this.font,
            (font) => {
                geo["font"] = font;
                this.geo = new TextGeometry('Hello', geo);
                this.mat = new three.MeshPhysicalMaterial(mat);
                const mesh = new three.Mesh(this.geo, this.mat);
                this.threeObj.add(mesh);
            }
        );
    }
}