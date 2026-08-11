const IGNORED_PROPERTIES = new Set([
    // Object identity
    "id",
    "uuid",
    "type",
    "name",

    // Runtime state
    "version",
    "needsUpdate",

    // Type flags
    "isMaterial",
    "isMeshBasicMaterial",
    "isMeshStandardMaterial",
    "isMeshPhysicalMaterial",
    "isMeshPhongMaterial",

    // Internal
    "defines",
    "userData",

    // Methods accidentally encountered
    "constructor"
]);
const INCLUDED_PROPERTIES = new Set([
    "color",
    "roughness",
    "metalness",
    "transparent",
    "opacity",
    "emissive",
    "emissiveIntensity",
    "clearcoat",
    "clearcoatRoughness",
    "transmission",
    "ior",
    "thickness",
    "sheen",
    "sheenColor",
    "reflectivity",
    "iridescence",
    "iridescenceIOR",
    "attenuationColor",
    "anisotropy",
    "bumpMap",
    "bumpScale",
    "displacementMap",
    "displacementScale",
    "normalMap",
    "normalScale",
    "map",
    "aoMap",
    "aoMapIntensity",
    "emissiveMap",
]);

class MaterialScanner {
    constructor() {
        this.materials = ["MeshStandardMaterial", "MeshPhysicalMaterial", "MeshPhongMaterial", "MeshBasicMaterial", "MeshLambertMaterial", "MeshNormalMaterial", "MeshToonMaterial"];
        this.properties = new Map();
        this.materialProperties = new Map();
    }
    scan(three) {
        for ( const materialName of this.materials ) {
            const material = new three[materialName]();
            const props = new Set();

            for ( const key in material ) {
                if ( ! INCLUDED_PROPERTIES.has(key) )
                    continue;
                if ( IGNORED_PROPERTIES.has(key) )
                    continue;

                props.add(key);

                let prop = this.properties.get(key);

                if ( !prop ) {
                    prop = {
                        materials: new Set(),
                        type: typeof material[key]
                    };
                    this.properties.set(key, prop);
                }
                prop.materials.add(materialName);
            }
            this.materialProperties.set(materialName, props);
            material.dispose();
        }
    }
    log() {
        console.log(this.materialProperties);
    }
}