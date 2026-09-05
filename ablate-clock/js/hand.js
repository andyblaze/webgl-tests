import { clamp } from "./functions.js";

export default class Hand {
    constructor(three, name, cfg) {
        this.name = name;
        // Hand geometry & setup
        Object.assign(this, {...cfg.hands[name]});

        this.angle = this.initialAngle;

        this.positions = new Float32Array((this.segments + 1) * 2 * 3);
        this.indices = [];

        for ( let i = 0; i < this.segments; i++ ) {
            const a = i * 2;
            const b = a + 2;

            this.indices.push(
                a, a + 1, b,
                a + 1, b + 1, b
            );
        }

        this.geometry = new three.BufferGeometry();
        this.geometry.setAttribute(
            "position",
            new three.BufferAttribute(this.positions, 3)
        );
        this.geometry.setIndex(this.indices);

        this.material = new three.MeshBasicMaterial({
            color: 0x00ffff,
            side: three.DoubleSide
        });

        this.threeObj = new three.Mesh(this.geometry, this.material);
        this.threeObj.rotation.z = this.angle;
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
        this.angle += dt * this.speed * this.direction * speedMultiplier;
        this.threeObj.rotation.z = this.angle;

        const flexibleStart = 0.125;
        const clampedBend = clamp(speedMultiplier, speedMultiplier * this.bendMin, speedMultiplier * this.bendMax);
        const maxBend = (this.speed * -this.direction) * clampedBend;
        let x = 0;
        let y = 0;

        for ( let i = 0; i <= this.segments; i++ ) {
            const t = i / this.segments;
            // Work out the bend of this segment.
            let bend = 0;

            if ( t > flexibleStart ) {
                const flexT = (t - flexibleStart) / (1 - flexibleStart);
                bend = (1 - Math.cos(flexT * Math.PI / 2)) * maxBend;
            }

            // Position the segment.
            if ( i > 0 ) {
                const segmentLength = this.length / this.segments;
                x += Math.cos(bend) * segmentLength;
                y += Math.sin(bend) * segmentLength;
            }
            const index = i * 2 * 3;
            this.updateGeometry(index, x, y);
        }
        this.geometry.attributes.position.needsUpdate = true;
    }
}
