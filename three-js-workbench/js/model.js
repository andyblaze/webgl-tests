import ThreeObject from "./three-object.js";

export default class Model extends ThreeObject {
    constructor(three, cfg) {
        super();
        this.geometry = new three.BoxGeometry(6, 6, 6);
        const bumpMap = new three.TextureLoader().load("./textures/spots.png");
        const normalMap = new three.TextureLoader().load("./textures/spots-normal.png");
        this.material = new three.MeshPhysicalMaterial({
            ...cfg.material,
            bumpMap,
            bumpScale: 2,
            normalMap
        });
        //this.material = new three.MeshStandardMaterial(cfg.material);
        this.nativeObj = new three.Mesh(this.geometry, this.material);
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
