export default class PinionGear {
    constructor() {
    }
    init(gear, data) {
        this.gear = gear;
        Object.assign(this, data);
    }
    build(three, gear, data) {
        this.init(gear, data);
        //this.buildSpokes(three);
        this.buildHub(three);
        //this.buildRim(three);
        return this.parts;
    }
    buildHub(three) {
        const r = this.innerRadius * 1.1;
        const hubGeometry = new three.CylinderGeometry(            
            r, r, 
            this.hubThickness, 32
        );

        this.gear.addToGroup(new three.Mesh(hubGeometry, this.material));  
        this.gear.group.scale.set(1, 6, 1);  
    }
}
