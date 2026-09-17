export default class ThreeObj {
    constructor() {
        this.threeObj = null;
        this.effects = [];
    }
    addEffects(e) {
        this.effects = e;
        for ( const e of this.effects )
            e.start(this);
        return this;
    }
    get native() {
        return this.threeObj;
    }
    doUpdate(dt, elapsed) {}
    update(dt, elapsed) {
        for ( const e of this.effects ) {
            e.update(this, dt);
        }
        this.doUpdate(dt, elapsed);
    }
    setPosition(x, y, z) {
        this.threeObj.position.set(x, y, z);
        return this;
    }
    setScale(x, y, z ) {
        this.threeObj.scale.set(x, y, z); 
        return this;      
    }
    setRotation(x, y, z) {
        this.threeObj.rotation.set(x, y, z);
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
