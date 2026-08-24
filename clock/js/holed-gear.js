export default class HoledGear {
    constructor() {
    }

    init(gear, data) {
        this.gear = gear;
        Object.assign(this, data);
    }

    build(three, gear, data) {
        this.init(gear, data);
        this.buildBody(three);
        this.buildHub(three);
    }

    buildBody(three) {
        const shape = new three.Shape();

        // Outer gear body
        shape.absarc(
            0, 0,
            this.outerRadius,
            0,
            Math.PI * 2,
            false
        );

        // Two holes, 180 degrees apart
        const holeRadius = 1;

        const holeDistance = (
            this.hubRadius +
            this.outerRadius
        ) / 2;

        for (let i = 0; i < 2; i++) {
            const angle = i * Math.PI;

            const x = Math.cos(angle) * holeDistance;
            const y = Math.sin(angle) * holeDistance;

            const hole = new three.Path();

            hole.absarc(
                x, y,
                holeRadius,
                0,
                Math.PI * 2,
                true
            );

            shape.holes.push(hole);
        }

        const geometry = new three.ExtrudeGeometry(
            shape,
            {
                depth: this.gearThickness,
                bevelEnabled: false,
                curveSegments: 48
            }
        );

        const body = new three.Mesh(geometry, this.material);

        // ExtrudeGeometry starts along +Z.
        // Rotate into the XZ plane.
        body.rotation.x = Math.PI / 2;
        // Centre thickness around Y.
        body.position.y = this.gearThickness / 2;

        this.gear.addToGroup(body);
    }

    buildHub(three) {
        const r = this.hubRadius * 1.2;
        const hubGeometry = new three.CylinderGeometry(r, r, this.hubThickness * 6, 32);
        this.gear.addToGroup(new three.Mesh(hubGeometry, this.material));
    }
}