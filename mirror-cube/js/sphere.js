export default class Sphere {
    constructor(three, pos) {
        this.sphereRadius = 0.125;
        this.sphereGeometry = new three.SphereGeometry(this.sphereRadius, 32, 32);
        this.sphereMaterial = new three.MeshStandardMaterial({
            color: 0xff2244,
            roughness: 0.25,
            metalness: 0.1
        }); 

        this.sphere = new three.Mesh(
            this.sphereGeometry,
            this.sphereMaterial.clone()
        );

        this.sphere.position.copy(pos);
        this.sphere.material.color.setHSL(Math.random(), 0.8, 0.5);
    }
    get mesh() {
        return this.sphere
    }
    update(p) {
        this.sphere.position.y += p;//Math.sin(t) * 0.002;
    }
}
