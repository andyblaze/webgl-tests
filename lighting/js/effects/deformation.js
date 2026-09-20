import GravityWell from "./gravity-well.js";
import Mesh from "./mesh.js";
import Field from "./field.js";
import Noise from "./noise.js";
import EffectBase from "./effect-base.js";

export default class Deformation extends EffectBase {
    constructor() {
        super();
        this.noise = new Noise();
        this.mesh = null;
        this.wells = this.makeWells(16);
        this.field = new Field(this.wells);
    }
    start(parent) {
        const positions = parent.geometry.attributes.position;
        this.mesh = new Mesh(positions);
        return this.init();
    }
    update(parent, time) {
        this.field.update(time.timestamp);
        this.mesh.update(time.timestamp, this.field);
    }
    makeWells(nWells) {
        const wells = [];
        for ( let i = 0; i < nWells; i++ )
            wells.push(new GravityWell(this.noise));   
        return wells; 
    }
}
