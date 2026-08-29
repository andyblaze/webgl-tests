import { degToRad } from "./functions.js";
import { ROT90 } from "./consts.js";
import MoveableGroup from "./moveable-group.js";

export default class GearShaft extends MoveableGroup {
    constructor(three, name, cfg) {
        super(three);
        this.buildShaft(three, name, cfg);
    }
    buildShaft(three, name, cfg) {
        const data = cfg.shafts[name];
        this.geometry = new three.CylinderGeometry(data.radius, data.radius, data.length);
        this.material = new three.MeshStandardMaterial(cfg.brushedSteel);
        this.shaft = new three.Mesh(
            this.geometry,
            this.material
        ); 
        this.shaft.rotation.x += ROT90;
        const { x, y, z } = {...data.position};
        this.setPosition(x, y, z);   
        this.addToGroup(this.shaft);     
    }
    attach(gear, pz=0, py=0) {
        const x = this.group.position.x;
        const y = this.group.position.y + py;
        const z = this.group.position.z + pz;
        gear.setPosition(x, y, z);
        //this.group.add(gear.native);
    }
    update(velocity) {
        this.group.rotation.y += velocity;   
    }
}