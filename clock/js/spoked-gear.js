export default class SpokedGear {
    constructor() {
    }
    init(gear, data) {
        this.gear = gear;
        Object.assign(this, data);
    }
    build(three, gear, data) {
        this.init(gear, data);
        this.buildSpokes(three);
        this.buildHub(three);
        this.buildRim(three);
    }
    buildSpokes(three) {
        for (let i = 0; i < this.spokeCount; i++) {

            const angle = (i / this.spokeCount) * Math.PI * 2;

            const spokeGeometry = new three.BoxGeometry(this.spokeLength, this.spokeThickness, this.spokeWidth);

            const spoke = new three.Mesh(spokeGeometry, this.material);

            // Move the spoke halfway between hub and rim
            const spokeRadius = this.hubRadius + this.spokeLength / 2 - 0.05;

            spoke.position.x = Math.cos(angle) * spokeRadius;
            spoke.position.z = Math.sin(angle) * spokeRadius;

            // Point the spoke radially outward
            spoke.rotation.y = -angle;

            this.gear.addToGroup(spoke);
        }
    }
    buildHub(three) {
        const hubGeometry = new three.CylinderGeometry(
            this.hubRadius, this.hubRadius, 
            this.hubThickness, 32
        );

        this.gear.addToGroup(new three.Mesh(hubGeometry, this.material));    
    }
    buildRim(three) {
        const innerRadius = this.innerRadius;
        const outerRadius = this.outerRadius;

        // Outer circular shape
        const shape = new three.Shape();

        shape.absarc(
            0, 0,
            outerRadius,
            0,
            Math.PI * 2,
            false
        );

        // Cut out the centre
        const hole = new three.Path();

        hole.absarc(
            0, 0,
            outerRadius * 0.96,
            0,
            Math.PI * 2,
            true
        );

        shape.holes.push(hole);

        // Extrude the ring into a solid 3D rim
        const rimGeometry = new three.ExtrudeGeometry(
            shape,
            {
                depth: this.gearThickness,
                bevelEnabled: false,
                curveSegments: 48
            }
        );

        const rim = new three.Mesh(
            rimGeometry,
            this.material
        );

        // ExtrudeGeometry starts along +Z.
        // Rotate it so that it lies in the XZ plane, matching your spokes and teeth.
        rim.rotation.x = Math.PI / 2;

        // Centre the thickness around Y
        rim.position.y = this.gearThickness / 2;

        this.gear.addToGroup(rim);
    }
}
