import { degToRad } from "./functions.js";

export default class GearShaft {
    constructor(three, name, cfg) {
        this.items = new three.Group();
        this.buildShaft(three, name, cfg);
    }
    buildShaft(three, name, cfg) {
        this.geometry = new three.CylinderGeometry(0.25, 0.25, 4);
        this.material = new three.MeshStandardMaterial(cfg.brushedSteel);
        this.shaft = new three.Mesh(
            this.geometry,
            this.material
        ); 
        this.shaft.rotation.x += degToRad(90);
        const { x, y, z } = {...cfg.shafts[name].position};
        this.setPosition(x, y, z);   
        this.items.add(this.shaft);     
    }
    attach(gear) {
        gear.setPosition(0, 0, 0);
        this.items.add(gear.native);
    }
    update(velocity) {
        this.items.rotation.y += velocity;   
    }
    setPosition(x, y, z) {
        this.items.position.x = x;
        this.items.position.y = y;
        this.items.position.z = z;
    }
    setRotation(x, y, z) {
        this.items.rotation.x += x;
        this.items.rotation.y += y;
        this.items.rotation.z += z;
    }
    get native() {
        return this.items;
    }
}