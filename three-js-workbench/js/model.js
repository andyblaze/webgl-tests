import ThreeObject from "./three-object.js";

class TexLoader {
    constructor(three) {
        this.loader = new three.TextureLoader();
    }
    load(tex) {
        return this.loader.load(tex);
    }
}

export default class Model extends ThreeObject {
    constructor(three, cfg) {
        super();
        this.loader = new TexLoader(three);
        this.geometry = new three.BoxGeometry(6, 6, 6);
        this.normalMap = "";
        this.roughnessMap = "";
        this.material = new three.MeshPhysicalMaterial(cfg.material);
        //this.material = new three.MeshStandardMaterial(cfg.material);
        this.nativeObj = new three.Mesh(this.geometry, this.material);
    }
    setMap(prop, val) {
        if ( val.length === 0 ) return;
        if ( val === this[prop] ) return;
        const tex = this.loader.load(val);
        
        this.material[prop] = tex;
        this[prop] = val;
        console.log(prop, this[prop], val, this.material[prop] === tex, tex);
        this.material.needsUpdate = true;
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
            }
        }
    }
}
