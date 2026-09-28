export default class ThreeObj {
    constructor(three) {
        this.three = three;
        this.threeObj = null;
        this.effects = [];
        this.preppedForDeformation = false;
    }
    addEffects(e) {
        this.effects = e;
        for ( const e of this.effects )
            e.start(this);
        return this;
    }
    prepForBend(minSegments) {
        if ( true === this.preppedForDeformation ) return;

        if ( this.bendSegments < minSegments ) {

            this.geometry.dispose();

            this.geometry = new this.geometryType(this.radius, this.height, this.radialSegments, minSegments);

            this.threeObj.geometry = this.geometry;
        }

        const position = this.geometry.attributes.position;
        const halfHeight = this.height / 2;

        for ( let i = 0; i < position.count; i++ ) {
            position.setY(i, position.getY(i) + halfHeight);
        }

        position.needsUpdate = true;    
        this.preppedForDeformation = true;    
    }
    bendWith(bend) {
        if ( false === this.preppedForDeformation )
            this.prepForBend(bend.minSegments);
        bend.applyTo(this);
        const center = new this.three.Vector3();

        this.geometry.computeBoundingBox();
        this.geometry.boundingBox.getCenter(center);
        this.geometry.translate(-center.x, -center.y, -center.z);
    }
    get native() {
        return this.threeObj;
    }
    doUpdate(time) {}
    update(time) {
        for ( const e of this.effects ) {
            e.update(this, time);
        }
        this.doUpdate(time);
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
