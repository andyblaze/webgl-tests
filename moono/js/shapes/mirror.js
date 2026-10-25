import ThreeGroup from "../three/three-group.js";
import { Reflector } from "../examples/jsm/controls/Reflector.js";

export default class Mirror extends ThreeGroup {
    constructor(three, geo, mat) {
        super(three);
        const { width, height, texW, texH } = geo;
        this.geometry = new three.PlaneGeometry(width, height);
        const mirror = new Reflector(this.geometry, {
            clipBias: 0.003,
            textureWidth: texW,
            textureHeight: texH,
            color: mat.color
        });
        const frame = this.makeFrame(three, width, height);
        const backing = this.makeBacking(three, width, height);
        backing.position.z = -0.05;

        this.threeObj.add(backing);
        this.threeObj.add(frame);
        this.threeObj.add(mirror);
    }
    makeBacking(three, w, h) {
        return new three.Mesh(
            new three.PlaneGeometry(w+0.1, h+0.1),
            new three.MeshPhysicalMaterial({ color: 0xffffff, side: three.DoubleSide })
        );
    }
    makeFrame(three, mirrorW, mirrorH) {
        const outerW = (mirrorW + 0.2) / 2;
        const outerH = (mirrorH + 0.2) / 2;
        const innerW = mirrorW / 2;
        const innerH = mirrorH / 2;
        const shape = new three.Shape();

        shape.moveTo(-outerW, -outerH);
        shape.lineTo( outerW, -outerH);
        shape.lineTo( outerW,  outerH);
        shape.lineTo(-outerW,  outerH);
        shape.closePath();

        const hole = new three.Path();

        hole.moveTo(-innerW, -innerH);
        hole.lineTo( innerW, -innerH);
        hole.lineTo( innerW,  innerH);
        hole.lineTo(-innerW,  innerH);
        hole.closePath();

        shape.holes.push(hole);

        const geo = new three.ExtrudeGeometry(shape, {
            depth: 0.15,
            bevelEnabled: true,
            bevelThickness: 0.03,
            bevelSize: 0.03,
            bevelSegments: 2
        });
        return new three.Mesh(
            geo,
            new three.MeshPhysicalMaterial({ color: 0xffffff })
        );
    }
}
