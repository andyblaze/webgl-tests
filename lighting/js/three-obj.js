export default class ThreeObj {
    constructor() {
        this.threeObj = null;
        this.orbiting = false;
        this.orbitCenter = null;
        this.orbitRadius = null;
        this.orbitSpeed = 0;
        this.orbitAngle = 0;
    }
    get native() {
        return this.threeObj;
    }
    update(dt, elapsed) {
        this.updateOrbit(dt, elapsed);
    }
    updateOrbit(dt, elapsed) {
        if ( true === this.orbiting )
            this.orbit(dt);
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
    setOrbit(radius, speed) {
        this.orbitCenter = this.threeObj.position.clone();
        this.orbitRadius = radius;
        this.orbitSpeed = speed;
        this.orbitAngle = 0;
        this.orbiting = true;
        return this;
    }
    orbit(dt) {
        this.orbitAngle += this.orbitSpeed * dt;
        const ox = this.orbitCenter.x + Math.cos(this.orbitAngle) * this.orbitRadius;
        const oy = this.orbitCenter.y + Math.sin(this.orbitAngle) * this.orbitRadius;
        this.setPosition(ox, 0, 0);
    }
}
