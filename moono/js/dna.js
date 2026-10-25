import * as THREE from "three";
import { mt_rand } from "./functions.js";
import ThreeGroup from "./three/three-group.js";

class HelixCurve extends THREE.Curve {

    constructor(width, pitch, phase=0) {
        super();
        this.radius = width / 2;
        this.pitch = pitch;
        this.phase = phase;
    }
    getPoint(t, optionalTarget=new THREE.Vector3()) {
        const angle = 2 * Math.PI * t + this.phase;

        const x = this.radius * Math.cos(angle);
        const y = this.pitch * t;
        const z = this.radius * Math.sin(angle);

        return optionalTarget.set(x, y, z);
    }
}

class HelixSegment extends ThreeGroup {
    constructor(three, geo, mat) {
        super(three);
        this.numRungs = 6; // only used when creating a dna strand
        const { width, pitch, tubeRadius, tubularSegments, radialSegments } = geo;

        this.curveA = new HelixCurve(width, pitch, 0);
        this.curveB = new HelixCurve(width, pitch, Math.PI);

        this.geometryA = new three.TubeGeometry(this.curveA, tubularSegments, tubeRadius, radialSegments);
        this.geometryB = new three.TubeGeometry(this.curveB, tubularSegments, tubeRadius, radialSegments);

        this.material = new three.MeshPhysicalMaterial(mat);

        this.meshA = new three.Mesh(this.geometryA, this.material);
        this.meshB = new three.Mesh(this.geometryB, this.material);        

        this.threeObj.add(this.meshA);
        this.threeObj.add(this.meshB);

        this.addRungs(three, this.numRungs);
    }
    makeConnector(three, pos) {
        const c = new three.Mesh(
            new three.SphereGeometry(0.07),
            this.material
        );
        c.position.y = pos;
        return c;
    }
    halfRung(three, length, pos, c) {
        const r = new three.Mesh(
            new three.CylinderGeometry(0.05, 0.05, length, 8),
            new three.MeshPhysicalMaterial({ color: c, emissive: c, emissiveIntensity: 0.5, roughness: 0.7, metalness: 0.3,
                clearcoat: 0.75, clearcoatRoughness: 0.25, sheenColor: c, sheen: 0.2 })
        );  
        r.position.y = pos;  
        return r;
    }
    makeRung(three, length) {
        const grp = new three.Group();

        const c1 = this.makeConnector(three, length - (length / 2));
        grp.add(c1);
        const c2 = this.makeConnector(three, -(length / 2));
        grp.add(c2);

        const colors = [0xff0000, 0x00ff00, 0x0000ff, 0x00ffff];
        const idx1 = mt_rand(0, 4);
        let idx2 = mt_rand(0, 4);
        while ( idx1 == idx2 ) {
            idx2 = mt_rand(0, 4);
        }

        const m1 = this.halfRung(three, length / 2, length / 4, colors[idx1]);
        grp.add(m1);
        const m2 = this.halfRung(three, length / 2, -(length / 4), colors[idx2]);
        grp.add(m2);

        return grp;     
    }
    addRungs(three, n) {
        const spacing = 0.18;
        const offset = 0.05;
        const unitVec = new three.Vector3(0, 1, 0);
        const dirVec = new three.Vector3();
        for ( let i = 0; i < n; i++ ) {
            const a = this.curveA.getPoint(i * spacing + offset);
            const b = this.curveB.getPoint(i * spacing + offset);

            const direction = dirVec.subVectors(b, a);
            const length = direction.length();

            const rung = this.makeRung(three, length);
            rung.position.copy(a).add(b).multiplyScalar(0.5);
            rung.quaternion.setFromUnitVectors(unitVec, direction.normalize());

            this.threeObj.add(rung);
        }
    }
    get native() {
        return this.threeObj;
    }
}

export default class Dna extends ThreeGroup {
    constructor(three, numSegments, geo, mat) {
        super(three);
        this.three = three;
        //this.threeObj = new three.Group();
        this.addSegments(three, numSegments, geo, mat);
        this.center(three);
    }
    addSegments(three, n, geo, mat) {
        for ( let i = 0; i < n; i++ ) {
            const a = new HelixSegment(three, geo, mat, 0);
            const b = new HelixSegment(three, geo, mat, Math.PI);

            a.native.position.y = geo.pitch * i;
            b.native.position.y = geo.pitch * i;

            this.threeObj.add(a.native);
            this.threeObj.add(b.native);
        }
    }
    center(three) {
        const box = new three.Box3().setFromObject(this.threeObj);
        const size = new three.Vector3();
        box.getSize(size);
        this.threeObj.position.y = -size.y / 2;
    }
    update(dt) {
        this.threeObj.rotation.y += dt * 0.4;
    }
    get native() {
        return this.threeObj;
    }
}