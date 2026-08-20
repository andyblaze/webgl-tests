export default class GearWheel {
    constructor(three, data, cfg) {
        this.innerRadius = data.inner;
        this.spokeCount = data.spokes;
        this.toothCount = data.teeth;

        this.toothWidth = 0.32;
        this.toothDepth = 0.35;
        this.toothPitch = 0.6602253311059799;
        this.toothRadius = 0;
        
        this.direction = data.direction;
        this.speed = data.speed;

        this.velocity = this.speed * this.direction;

        this.outerRadius = 0;
        
        this.doMaths();
        
        this.gearMaterial = new three.MeshStandardMaterial(cfg.brushedBrass);

        this.toothMaterial = new three.MeshStandardMaterial(cfg.redBrass);    
        
        this.gear = new three.Group(); 

        this.buildHub(three);
        this.buildRim(three);
        this.buildSpokes(three); 
        this.buildTeeth(three);

        this.gear.rotation.x = Math.PI / 2;
    }
    doMaths() {
        this.gearThickness = 0.15;
        this.hubRadius = this.innerRadius * 0.45;
        this.hubThickness = this.gearThickness * 1.4;

        this.toothRadius = (this.toothPitch * this.toothCount) / (2 * Math.PI);
        this.outerRadius = this.toothRadius - this.toothDepth / 8;
        this.spokeLength = this.outerRadius - this.hubRadius + 0.1;
        this.spokeWidth = 0.35;
        this.spokeThickness = this.gearThickness / 2;
    }
    setPosition(x, y, z) {
        this.gear.position.x = x;
        this.gear.position.y = y;
        this.gear.position.z = z;
    }
    setRotation(x, y, z) {
        this.gear.rotation.x += x;
        this.gear.rotation.y += y;
        this.gear.rotation.z += z;
    }
    get native() {
        return this.gear;
    }
    addToGroup(item) {
        this.gear.add(item);
    }
    update(velocity) {
        this.gear.rotation.y += velocity;   
    }
    buildTeeth(three) {
        for (let i = 0; i < this.toothCount; i++) {
            const angle = (i / this.toothCount) * Math.PI * 2;

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

        toothGeometry.rotateY(Math.PI / 4);

        // Scale the tooth in x & z so it looks really good and fits the gear thickness
        toothGeometry.scale(
            this.gearThickness / (toothWidth / 0.7),
            1,        
            1.5
        );

        const tooth = new three.Mesh(
            toothGeometry,
            this.toothMaterial
        );

        tooth.rotation.z = Math.PI / 2;

        return tooth;
    }
    buildSpokes(three) {
        for (let i = 0; i < this.spokeCount; i++) {

            const angle = (i / this.spokeCount) * Math.PI * 2;

            const spokeGeometry = new three.BoxGeometry(this.spokeLength, this.spokeThickness, this.spokeWidth);

            const spoke = new three.Mesh(spokeGeometry, this.gearMaterial);

            // Move the spoke halfway between hub and rim
            const spokeRadius = this.hubRadius + this.spokeLength / 2 - 0.05;

            spoke.position.x = Math.cos(angle) * spokeRadius;
            spoke.position.z = Math.sin(angle) * spokeRadius;

            // Point the spoke radially outward
            spoke.rotation.y = -angle;

            this.addToGroup(spoke);
        }
    }
    buildHub(three) {
        const hubGeometry = new three.CylinderGeometry(
            this.hubRadius, this.hubRadius, 
            this.hubThickness, 32
        );

        const hub = new three.Mesh(hubGeometry, this.gearMaterial);

        this.addToGroup(hub);    
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
            this.gearMaterial
        );

        // ExtrudeGeometry starts along +Z.
        // Rotate it so that it lies in the XZ plane, matching your spokes and teeth.
        rim.rotation.x = Math.PI / 2;

        // Centre the thickness around Y
        rim.position.y = this.gearThickness / 2;

        this.addToGroup(rim);
    }
}
