import ThreeObject from "./three-object.js";

export default class Model extends ThreeObject {
    constructor(loader, factory, cfg) {
        super();
        this.loader = loader;
        this.factory = factory;
        this.geometryType = cfg.geometry;
        this.geometry = factory.createGeometry(cfg.geometry);//new three.BoxGeometry(6, 6, 6);
        this.normalMap = "";
        this.roughnessMap = "";
        this.material = factory.createMaterial(cfg.materialType, cfg.material); //new three.MeshPhysicalMaterial(cfg.material);
        //this.material = new three.MeshStandardMaterial(cfg.material);
        this.nativeObj = factory.createMesh(this.geometry, this.material); //new three.Mesh(this.geometry, this.material);
    }
    setMap(prop, val) {
        if ( val.length === 0 ) return;
        if ( val === this[prop] ) return;
        const tex = this.loader.load(val);
        
        this.material[prop] = tex;
        this[prop] = val;
        //console.log(prop, this[prop], val, this.material[prop] === tex, tex);
        this.material.needsUpdate = true;
    }
    setGeometry(prop, geo) {
        if (this.geometryType === geo.value) return;
        this.geometry.dispose();
        this.geometry = this.factory.createGeometry(geo.value);
        this.geometryType = geo.value;
        this.nativeObj.geometry = this.geometry;
    }
    update(material) {
        for ( const [prop, data] of Object.entries(material) ) {

            switch (data.type) {
                case "float":
                case "int":
                case "bool":
                this.material[prop] = data.value;
                break;

                case "color":
                    this.material[prop].set(data.value);
                    break;

                case "vec2":
                    this.material[prop].set(data.value[0], data.value[1]);
                    break;

                case "map":
                    this.setMap(prop, data.value);
                    break;
                case "geometries" :
                    this.setGeometry(prop, data);
                    break;
            }
        }
    }
}
