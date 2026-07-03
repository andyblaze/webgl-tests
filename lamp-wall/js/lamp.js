import Blob from "./blob.js";

export default class Lamp {
    constructor(three) {
        this.height = 4;
        this.group = new three.Group();
        
        this.blob = new Blob(three, 0.25);
        this.group.add(this.blob.actual);

        this.makeGlass(three);

        const capGeo = new three.CylinderGeometry(0.32, 0.38, 0.5);
        const baseGeo = new three.CylinderGeometry(0.8, 0.6, 0.5, 32, 1, true);
        const steelMat = new three.MeshPhysicalMaterial({
            color: 0xb8bcc2,
            metalness: 1.0,
            roughness: 0.28,
        });

        this.makeCap(three, capGeo, steelMat);
        this.makeBase(three, baseGeo, steelMat);        
        this.makeLight(three);
        
    }
    makeGlass(three) {
        const glassGeometry = new three.CylinderGeometry(0.32, 0.8, this.height);
        const glassMaterial = new three.MeshPhysicalMaterial({
            transmission: 0.371,
            transparent: true,
            opacity: 0.102492,
            roughness: 0.8,
            thickness: 0.8,
        });

        this.glass = new three.Mesh(glassGeometry, glassMaterial);
        this.group.add(this.glass);
    }
    makeCap(three, geo, mat) {
        this.cap = new  three.Mesh(geo, mat);
        this.cap.position.y = this.height - 2.2;
        this.group.add(this.cap);
    }
    makeBase(three, geo, mat) {
        this.base = new  three.Mesh(geo, mat);
        this.base.position.y = -(this.height - 1.8);
        this.group.add(this.base);
    }
    makeLight(three) {
        this.lamplight = new three.PointLight(0xff6600, 100, 4);
        this.lamplight.position.y = -(this.height - 1.6);
        this.group.add(this.lamplight);
    }
    setPosition(x, y, z) {
        this.group.position.x = x;
        this.group.position.y = y;
        this.group.position.z = z;
    }
    update(dt) {
        this.blob.update(dt);
    }
    get actual() {
        return this.group;
    }
}
