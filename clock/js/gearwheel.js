import MoveableGroup from "./moveable-group.js";
import { ROT45, ROT90, ROT360 } from "./consts.js";
import { randomFrom } from "./functions.js";

export default class GearWheel extends MoveableGroup {
    constructor(three, name, cfg, builder) {
        super(three, name);
        const data = cfg.gears[name].data;
        this.innerRadius = data.inner;
        this.toothCount = data.teeth;

        this.spokeCount = data.spokes ?? randomFrom([2, 3, 4, 5]);

        this.toothWidth = cfg.toothWidth;
        this.toothDepth = cfg.toothDepth;
        this.toothPitch = cfg.toothPitch;
        this.toothRadius = 0;
        
        this.direction = data.direction ?? 0;
        this.rpm = data.rpm ?? 0;

        this.velocity = this.rpm * (ROT360 / 60) * this.direction; // convert rpm to radians per second

        this.outerRadius = 0;
        
        this.doMaths();
        
        this.gearMaterial = new three.MeshStandardMaterial(cfg.brushedBrass);

        this.toothMaterial = new three.MeshStandardMaterial(cfg.brushedBrass);

        const gearData = {
            spokeCount: this.spokeCount,
            spokeLength: this.spokeLength, 
            spokeThickness: this.spokeThickness, 
            spokeWidth: this.spokeWidth,
            material: this.gearMaterial,
            hubRadius: this.hubRadius,
            hubThickness: this.hubThickness,
            gearThickness: this.gearThickness,
            innerRadius: this.innerRadius,
            outerRadius: this.outerRadius
        };
        this.buildTeeth(three);
        builder.build(three, this, gearData);

        this.group.rotation.x = ROT90;
        this.group.rotation.y += cfg.gears[name].rotationY;
    }
    getRatio(gear) {
        return this.toothCount / gear.toothCount;
    }
    get rpmReport() {
        return this.velocity * this.direction * 60 / ROT360;
    }
    doMaths() {
        this.gearThickness = 0.25;
        this.hubRadius = this.innerRadius * 0.45;
        this.hubThickness = this.gearThickness * 1.4;

        this.toothRadius = (this.toothPitch * this.toothCount) / ROT360;
        this.outerRadius = this.toothRadius - this.toothDepth / 8;
        this.spokeLength = this.outerRadius - this.hubRadius + 0.1;
        this.spokeWidth = 0.35;
        this.spokeThickness = this.gearThickness / 2;
    }
    update(dt) { 
        this.group.rotation.y += (this.velocity * this.direction) * dt;   
    }
    buildTeeth(three) {
        for (let i = 0; i < this.toothCount; i++) {
            const angle = (i / this.toothCount) * ROT360;

            const tooth = this.buildTooth(three, this.toothWidth, this.toothDepth);

            tooth.position.x = Math.cos(angle) * this.toothRadius;
            tooth.position.z = Math.sin(angle) * this.toothRadius;
            // Rotate the tooth so it points radially outward
            tooth.rotation.y = -angle;

            this.addToGroup(tooth);    
        }
    }
    buildTooth(three, toothWidth, toothDepth) {
        // cylinder hackery to get a nice shaped tooth :) 
        const toothGeometry = new three.CylinderGeometry(
            toothWidth,      // bottom radius 
            toothWidth / 3,  // top radius     
            toothDepth,
            4
        );

        toothGeometry.rotateY(ROT45);

        // Scale the tooth in x & z so it looks really good and fits the gear thickness
        toothGeometry.scale(
            this.gearThickness / (toothWidth / 0.7),
            1,        
            1.5
        );

        const tooth = new three.Mesh(toothGeometry, this.toothMaterial);
        tooth.rotation.z = ROT90;
        return tooth;
    }
}
