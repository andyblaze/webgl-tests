import { clamp } from "./functions.js";

export default class Hand {
    constructor(three, name, cfg) {
        this.ablation = null;
        this.tip = new three.Vector3(0, 0, 0);
        this.name = name;
        // Hand geometry & setup
        Object.assign(this, {...cfg.hands[name]});

        this.angle = this.initialAngle;
        this.flexibleStart = 0.125;

        this.positions = new Float32Array((this.segments + 1) * 2 * 3);
        this.indices = [];
        this.initIndices();
        this.initMesh(three);
    }
    initMesh(three) {
        this.geometry = new three.BufferGeometry();
        this.geometry.setAttribute(
            "position",
            new three.BufferAttribute(this.positions, 3)
        );
        this.geometry.setIndex(this.indices);

        this.material = new three.MeshPhysicalMaterial({
            color: 0x00ffff,
            emissive: 0x00ffff,
            emissiveIntensity: 1,
            metalness: 0,
            roughness: 0.3,
            side: three.DoubleSide
        });

        this.threeObj = new three.Mesh(this.geometry, this.material);
        this.threeObj.castShadow = true;
        this.threeObj.rotation.z = this.angle;
    }
    initIndices() {
        for ( let i = 0; i < this.segments; i++ ) {
            const a = i * 2;
            const b = a + 2;

            this.indices.push(
                a, a + 1, b,
                a + 1, b + 1, b
            );
        }
    }
    get native() {
        return this.threeObj;
    }
    updateGeometry(index, x, y) {
        const pos = this.geometry.attributes.position.array;
        const halfWidth = this.width / 2; 

        pos[index + 0] = x;
        pos[index + 1] = y - halfWidth;
        pos[index + 2] = 0;

        pos[index + 3] = x;
        pos[index + 4] = y + halfWidth;
        pos[index + 5] = 0;   
    }
    update(dt, speedMultiplier) {
        this.updateRotation(dt, speedMultiplier);

        const maxBend = this.calcMaxBend(speedMultiplier);
        let x = 0;
        let y = 0;

        for ( let i = 0; i <= this.segments; i++ ) {
            const t = i / this.segments;               

            // Position the segment.
            if ( i > 0 ) {
                const bend = this.calcBend(t, maxBend);
                const pos = this.positionSegment(bend);
                x += pos.x;
                y += pos.y;
            }
            const index = i * 2 * 3;
            this.updateGeometry(index, x, y);          
            
            this.ablate(dt, x, y, speedMultiplier);         
        }        

        this.geometry.attributes.position.needsUpdate = true;
    }
    updateRotation(dt, speedMultiplier) {
        this.angle += dt * this.speed * this.direction * speedMultiplier;
        this.threeObj.rotation.z = this.angle;        
    }
    calcMaxBend(speedMultiplier) {
        const clampedBend = clamp(speedMultiplier, speedMultiplier * this.bendMin, speedMultiplier * this.bendMax);
        return (this.speed * -this.direction) * clampedBend;
    }
    calcBend(t, maxBend) {
        let bend = 0;

        if ( t > this.flexibleStart ) {
            const flexT = (t - this.flexibleStart) / (1 - this.flexibleStart);
            bend = (1 - Math.cos(flexT * Math.PI / 2)) * maxBend;
        }
        return bend;
    }
    positionSegment(bend) {
        const segmentLength = this.length / this.segments;
        return { x: Math.cos(bend) * segmentLength, y: Math.sin(bend) * segmentLength };        
    }
    ablate(dt, x, y, speedMultiplier) {
        const angularVelocity = -this.speed * this.direction * speedMultiplier;
        this.tip.x = x;
        this.tip.y = y;        
        this.threeObj.localToWorld(this.tip);
        this.ablation.emit(this.tip.x, this.tip.y, angularVelocity); 
        this.ablation.update(dt);   
    }
    addAblation(a, scene) {
        this.ablation = a;
        scene.add(a.native)
    }
}
