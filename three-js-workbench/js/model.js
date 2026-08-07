import ThreeObject from "./three-object.js";

export default class Model extends ThreeObject {
    constructor(three, cfg) {
        super();
        this.geometry = new three.BoxGeometry(6, 6, 6);
        const bumpMap = new three.TextureLoader().load("./cloud.png");
        const normalMap = new three.TextureLoader().load("./cloud-normal.png");
        this.material = new three.MeshPhysicalMaterial({
            ...cfg.material,
            bumpMap,
            bumpScale: 0.2,
            normalMap
        });
        //this.material = new three.MeshStandardMaterial(cfg.material);
        this.nativeObj = new three.Mesh(this.geometry, this.material);
    }
    update(material) {
        for ( const [prop, val] of Object.entries(material) ) {
            if ( typeof val === "string" )
                this.material[prop].set(val);
            else 
                this.material[prop] = val;
        }
    }
}
