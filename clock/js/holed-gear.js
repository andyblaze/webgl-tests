import { randomFrom } from "./functions.js";
import { ROT90, ROT360 } from "./consts.js";

export default class HoledGear {
    constructor() {
        this.cfgHoleCounts = [3, 5, 6];
    }
    build(three, gear, data) {
        this.gear = gear;
        Object.assign(this, data);

        this.buildBody(three);
        this.buildHub(three);
    }
buildBody(three) {
    const shape = new three.Shape();

    // Outer gear body
    shape.absarc(
        0, 0, this.outerRadius,
        0, ROT360, false
    );

    // Pick a hole count
    const holeCount = randomFrom(this.cfgHoleCounts);

    // Space available between hub and outer edge
    const availableRadius = this.outerRadius - this.hubRadius;

    // Put the holes roughly in the middle of that space
    const holeDistance = this.hubRadius + availableRadius / 2;

    // Keep holes comfortably inside the gear
    const holeRadius = availableRadius * 0.18;

    for (let i = 0; i < holeCount; i++) {
        const angle = (i / holeCount) * ROT360;

        const x = Math.cos(angle) * holeDistance;
        const y = Math.sin(angle) * holeDistance;

        const hole = new three.Path();

        hole.absarc(
            x, y, holeRadius,
            0, ROT360, true
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
    body.rotation.x = ROT90;
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