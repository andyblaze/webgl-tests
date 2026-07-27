import { mt_randf } from "./functions.js";

export default class Sphere {
    constructor(three, pos, cubeCentre) {
        this.setIdle();
        this.lastOrbitTime = 0;
        this.sphereRadius = 0.125;
        this.sphereGeometry = new three.SphereGeometry(this.sphereRadius, 32, 32);
        this.sphereMaterial = new three.MeshStandardMaterial({
            color: 0xff2244,
            roughness: 0.25,
            metalness: 0.75
        }); 

        this.sphere = new three.Mesh(
            this.sphereGeometry,
            this.sphereMaterial.clone()
        );

        this.sphere.position.copy(pos);
        this.sphere.material.color.setHSL(Math.random(), 0.8, 0.5);

        this.orbitCentre = cubeCentre.clone();

        this.orbitAngle = 0;
        this.currentAngle = 0;
        this.orbitSpeed = 0;
        this.maxOrbitSpeed = 0.01;
        this.acceleration = 0.0001;
        this.deceleration = 0.0001;
        this.targetAngle = 0;
        this.arcRemaining = 0;

        this.offset = pos.clone().sub(cubeCentre);
        this.orbitAxis = new three.Vector3(
            mt_randf(0.1, 0.5),
            mt_randf(0.1, 0.5),
            mt_randf(0.1, 0.5) 
        ).normalize();
    }
    startOrbit(arc) {
        if ( this.isIdle() ) this.setMoving(arc);
    }
    isIdle() {
        return this.state === "idle";
    }
    isMoving() {
        return this.state === "moving";
    }
    setIdle() {
        this.state = "idle";
        this.lastOrbitTime = Date.now();
    }
    setMoving(arc) {
        this.arcRemaining = arc;
        this.orbitSpeed = 0;
        this.state = "moving";
    }
    setMoving1(arc) {
        this.targetAngle = this.currentAngle + arc;
        this.arcLength = arc;
        this.arcRemaining = arc;
        this.state = "moving";
    }
    get mesh() {
        return this.sphere
    }
    accelerate() {
        if ( this.orbitSpeed < this.maxOrbitSpeed )
            this.orbitSpeed += this.acceleration;

        if ( this.orbitSpeed >= this.maxOrbitSpeed )
            this.orbitSpeed = this.maxOrbitSpeed;
    }
    decelerate() {
        this.orbitSpeed -= this.deceleration;

        if ( this.orbitSpeed <= 0 )
            this.orbitSpeed = 0;
    }
    update() {
        if (this.isIdle()) return;

        const progressRemaining = this.arcRemaining / this.arcLength;

        if ( progressRemaining < 0.25 ) {
            this.decelerate();
        } else {
            this.accelerate();
        }

        this.orbitAngle += this.orbitSpeed;
        this.currentAngle += this.orbitSpeed;
        this.arcRemaining -= this.orbitSpeed;

        const rotatedOffset = this.offset.clone();
        rotatedOffset.applyAxisAngle(this.orbitAxis, this.orbitAngle);

        this.sphere.position.copy(this.orbitCentre).add(rotatedOffset);

        if (this.arcRemaining <= 0) this.setIdle();
    }
}
