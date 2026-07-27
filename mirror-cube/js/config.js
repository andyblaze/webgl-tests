export default class Config {
    constructor(three) {
        this.cubeSize = 5;
        this.cubeCentre = new three.Vector3(0, 0, -8);
        this.cubeRadius = Math.sqrt(3) * this.cubeSize * 0.5;
        this.sphereRadius = 0.125;
        this.sphereCount = 120;
        this.groupSize = 4;
        this.maxOrbitSpeed = 0.01;
        this.acceleration = 0.0001;
        this.deceleration = 0.0001;
        this.minArc = 0.9;
        this.maxArc = 1.4;
        this.fogNear = 4;
        this.fogFar = 14;
    }
}