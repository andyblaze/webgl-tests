import ThreeObject from "./three-object.js";

export default class Model extends ThreeObject {
    constructor(three, cfg) {
        super();
        this.geometry = new three.TorusKnotGeometry( 3, 1, 128, 64 );
        this.material = new three.MeshPhysicalMaterial(cfg.material);
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
