export default class ThreeObj {
    constructor() {
        this.threeObj = null;
    }
    get native() {
        return this.threeObj;
    }
    update(dt, elapsed) {

    }
    setPosition(x, y, z) {
        this.threeObj.position.x = x;
        this.threeObj.position.y = y;
        this.threeObj.position.z = z;
        return this;
    }
    setRotation(x, y, z) {
        this.threeObj.rotation.x = x;
        this.threeObj.rotation.y = y;
        this.threeObj.rotation.z = z;
        return this;
    }
    rotate(x, y, z) {
        this.threeObj.rotation.x += x;
        this.threeObj.rotation.y += y;
        this.threeObj.rotation.z += z;        
        return this;
    }
    addTo(scene) {
        scene.add(this.threeObj);
        return this;
    }
    setShadows(cst=false, rcv=false) {
        this.threeObj.castShadow = cst;
        this.threeObj.receiveShadow = rcv;
        return this;
    }
}
