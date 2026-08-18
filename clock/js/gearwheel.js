export default class GearWheel {
    constructor(three, innerRadius, outerRadius, spokeCount, toothCount) {
        this.innerRadius = innerRadius;
        this.outerRadius = outerRadius;
        this.spokeCount = spokeCount;
        this.toothCount = toothCount;
        
        this.gearThickness = 0.15;
        this.hubRadius = innerRadius * 0.45;
        this.hubThickness = this.gearThickness * 1.4;
        
        this.gearMaterial = new three.MeshStandardMaterial({
            color: 0xefeb34,
            metalness: 0.25,
            roughness: 0.75,
            clearcoat: 1,
            clearcoatRoughness: 0.25,
            emissive: 0xf0bf4f,
            emissiveIntensity: 0.01,
            sheenColor: 0xeaaa15,
            sheen: 1,
            anisotropy: 1
        });

        this.toothMaterial = new three.MeshStandardMaterial({
            color: 0xefeb34,
            metalness: 0.25,
            roughness: 0.75,
            clearcoat: 1,
            clearcoatRoughness: 0.25,
            emissive: 0xf0bf4f,
            emissiveIntensity: 0.01,
            sheenColor: 0xeaaa15,
            sheen: 1,
            anisotropy: 1
        });    
        
        this.gear = new three.Group(); 

        this.buildHub(three);
        this.buildRim(three);
        this.buildSpokes(three);
        //this.buildTeeth(three);
    }
    get native() {
        return this.gear;
    }
    addToGroup(item) {
        this.gear.add(item);
    }
    update() {
        this.gear.rotation.x += 0.002;
        this.gear.rotation.y += 0.003;
        this.gear.rotation.z += 0.001;    
    }
    buildTeeth(three) {
        const toothWidth = 0.25;
        const toothDepth = 0.35;

        for (let i = 0; i < this.toothCount; i++) {
            const angle = (i / this.toothCount) * Math.PI * 2;

            const toothGeometry = new three.BoxGeometry(
                toothDepth,
                this.gearThickness,
                toothWidth
            );

            const tooth = new three.Mesh(toothGeometry, this.toothMaterial);

            // Put tooth just outside the rim
            const toothRadius = this.outerRadius + toothDepth / 2;

            tooth.position.x = Math.cos(angle) * toothRadius;
            tooth.position.z = Math.sin(angle) * toothRadius;

            // Rotate the tooth so it points radially outward
            tooth.rotation.y = -angle;

            this.addToGroup(tooth);    
        }
    }
    buildSpokes(three) {
        const spokeLength = this.outerRadius - this.hubRadius;
        const spokeWidth = 0.35;
        const spokeThickness = this.gearThickness / 2;

        for (let i = 0; i < this.spokeCount; i++) {

            const angle = (i / this.spokeCount) * Math.PI * 2;

            const spokeGeometry = new three.BoxGeometry(spokeLength, spokeThickness, spokeWidth);

            const spoke = new three.Mesh(spokeGeometry, this.gearMaterial);

            // Move the spoke halfway between hub and rim
            const spokeRadius = this.hubRadius + spokeLength / 2;

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
            innerRadius * 4.8,
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
        // Rotate it so that it lies in the XZ plane,
        // matching your spokes and teeth.
        rim.rotation.x = Math.PI / 2;

        // Centre the thickness around Y
        rim.position.y = -this.gearThickness / 2;

        this.addToGroup(rim);
    }
}
