export class Knot {
    constructor(three) {
        this.shape = new three.Mesh(
            new three.TorusKnotGeometry(1,0.35,128,16),
            new three.MeshStandardMaterial({
                color:0x55ccff,
                metalness:0.3,
                roughness:0.2
            })
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
            new three.MeshStandardMaterial({
                color:"orange",
                emissive:"orange",
                emissiveIntensity:0.3
            })
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
        this.shape = new three.Mesh(
            new three.PlaneGeometry(60, 60),
            new three.MeshStandardMaterial({
                color: 0x550000,
                roughness: 0.95,
                metalness: 0.05
            })
        );
        this.shape.rotation.x = -Math.PI / 2;
        this.shape.receiveShadow = true;
    }
}