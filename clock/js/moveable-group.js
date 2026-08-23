export default class MoveableGroup {
    constructor(three) {
        this.group = new three.Group();
    }
    setPosition(x, y, z) {
        this.group.position.x = x;
        this.group.position.y = y;
        this.group.position.z = z;
    }
    setRotation(x, y, z) {
        this.group.rotation.x += x;
        this.group.rotation.y += y;
        this.group.rotation.z += z;
    } 
    get native() {
        return this.group;
    }
}