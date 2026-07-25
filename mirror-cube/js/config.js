export default class Config {
    constructor(three) {
        this.cubeSize = 6;
        this.cubeCentre = new three.Vector3(0, 0, -8);
        this.cubeRadius = Math.sqrt(3) * this.cubeSize * 0.5;
    }
}