import { degToRad } from "./functions.js";
import MoveableGroup from "./moveable-group.js";

export default class GearShaft extends MoveableGroup {
    constructor(three, name, cfg) {
        super(three);
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
        this.group.add(this.shaft);     
    }
    attach(gear) {
        gear.setPosition(0, 0, 0);
        this.group.add(gear.native);
    }
    update(velocity) {
        this.group.rotation.y += velocity;   
    }
}