import { degToRad } from "./functions.js";
import { ROT90 } from "./consts.js";
import MoveableGroup from "./moveable-group.js";

export default class GearShaft extends MoveableGroup {
    constructor(three, name, cfg) {
        super(three);
        this.buildShaft(three, name, cfg);
    }
    buildShaft(three, name, cfg) {
        this.geometry = new three.CylinderGeometry(0.25, 0.25, 8);
        this.material = new three.MeshStandardMaterial(cfg.brushedSteel);
        this.shaft = new three.Mesh(
            this.geometry,
            this.material
        ); 
        this.shaft.rotation.x += ROT90;
        const { x, y, z } = {...cfg.shafts[name].position};
        this.setPosition(x, y, z);   
        this.addToGroup(this.shaft);     
    }
    attach(gear, d=0) {
        const x = this.group.position.x;
        const y = this.group.position.y;
        const z = this.group.position.z + d;
        gear.setPosition(x, y, z);
        //this.group.add(gear.native);
    }
    update(velocity) {
        this.group.rotation.y += velocity;   
    }
}