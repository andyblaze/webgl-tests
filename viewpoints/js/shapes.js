import Materials from "./materials.js";

export class Knot {
    constructor(three) {
        this.shape = new three.Mesh(
            new three.TorusKnotGeometry(1, 0.35, 128, 16),
            Materials.brass(three)
        );
        this.shape.position.y = 1.8;
        this.shape.castShadow = true;
    }
    update(t) {
        this.shape.rotation.x = t * 0.5;
        this.shape.rotation.y = t * 0.2;
        this.shape.rotation.z = t * 0.1;        
    }
}

export class Torus {
    constructor(three) {
        this.shape = new three.Mesh(
            new three.TorusGeometry(0.35, 0.1),
            Materials.brass(three)
        );
        this.shape.castShadow = true;
    }
    update(t) {
        this.shape.position.set(Math.cos(t) * 3, 1.5 + Math.sin(t * 2) * 0.5, Math.sin(t) * 3);
        this.shape.rotation.x = t * 0.73;
        this.shape.rotation.y = t * 0.91;
        //sphere.rotation.z = t * 0.17;        
    }
}

export class Floor {
    constructor(three) {
        const loader = new three.TextureLoader();
        const normal = loader.load("./js/oce.png");
        this.shape = new three.Mesh(
            new three.PlaneGeometry(60, 60),
            new three.MeshStandardMaterial({
                color:0x004422,
                //roughness: 0.95,
                //metalness: 0.05,
                normalMap: normal,
        normalScale: new three.Vector2(1,1),

        wireframe: false
            })
        );
        this.shape.rotation.x = -Math.PI / 2;
        this.shape.receiveShadow = true;
    }
}