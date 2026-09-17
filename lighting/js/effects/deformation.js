import GravityWell from "./gravity-well.js";
import Mesh from "./mesh.js";
import Field from "./field.js";
import Noise from "./noise.js";

export default class Deformation {
    constructor(plane) {
        const positions = plane.geometry.attributes.position;
        this.noise = new Noise();
        this.mesh = new Mesh(positions);
        this.wells = this.makeWells(16);
        this.field = new Field(this.wells);
    }
    update(t) {
        this.field.update(t);
        this.mesh.update(t, this.field);
    }
    makeWells(nWells) {
        const wells = [];
        for ( let i = 0; i < nWells; i++ )
            wells.push(new GravityWell(this.noise));   
        return wells; 
    }
}
