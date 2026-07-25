export default class Sphere {
    constructor(three, pos, cubeCentre) {
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

        this.orbitCentre = cubeCentre.clone();
        const offset = pos.clone().sub(cubeCentre);
        this.orbitRadius = Math.sqrt(
            offset.x * offset.x +
            offset.z * offset.z
        );

        this.orbitAngle = Math.atan2(offset.z, offset.x);
        this.orbitSpeed = 0.001;
    }
    get mesh() {
        return this.sphere
    }
    update() {
        this.orbitAngle += this.orbitSpeed;
        this.sphere.position.x = this.orbitCentre.x + Math.cos(this.orbitAngle) * this.orbitRadius;
        this.sphere.position.z = this.orbitCentre.z + Math.sin(this.orbitAngle) * this.orbitRadius;
    }
}
