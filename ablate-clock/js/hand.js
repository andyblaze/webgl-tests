import { clamp } from "./functions.js";

export default class Hand {
    constructor(three, name, cfg) {
        this.ablation = null;
        this.tip = new three.Vector3(0, 0, 0);
        this.name = name;

        // Hand geometry & setup
        Object.assign(this, {...cfg.hands[name]});

        this.angle = this.initialAngle;

        // 3 vertices per point:
        // left, ridge, right
        this.positions = new Float32Array((this.segments + 1) * 3 * 3);

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
            color: this.color,
            //emissive: 0x00ffff,
            //emissiveIntensity: 0.1,
            metalness: 0.75,
            roughness: 0.25,
            side: three.DoubleSide
        });

        this.threeObj = new three.Mesh(this.geometry, this.material);
        this.threeObj.castShadow = true;
        this.threeObj.rotation.z = this.angle;
    }

    initIndices() {
        for (let i = 0; i < this.segments; i++) {
            const a = i * 3;
            const b = a + 3;

            // Left face
            this.indices.push(
                a, b, a + 1,
                a + 1, b, b + 1
            );

            // Right face
            this.indices.push(
                a + 1, b, a + 2,
                a + 2, b, b + 2
            );
        }
    }

    get native() {
        return this.threeObj;
    }

    updateGeometry(index, x, y, bend) {
        const pos = this.geometry.attributes.position.array;

        const halfWidth = this.width / 2;
        const ridgeHeight = this.height / 2;

        // Direction perpendicular to the hand.
        const px = -Math.sin(bend);
        const py = Math.cos(bend);

        // Left
        pos[index + 0] = x - px * halfWidth;
        pos[index + 1] = y - py * halfWidth;
        pos[index + 2] = 0;

        // Ridge
        pos[index + 3] = x;
        pos[index + 4] = y;
        pos[index + 5] = ridgeHeight;

        // Right
        pos[index + 6] = x + px * halfWidth;
        pos[index + 7] = y + py * halfWidth;
        pos[index + 8] = 0;
    }

    update(dt, speedMultiplier) {
        this.updateRotation(dt, speedMultiplier);

        const maxBend = this.calcMaxBend(speedMultiplier);

        let x = 0;
        let y = 0;
        let bend = 0;

        for (let i = 0; i <= this.segments; i++) {
            const t = i / this.segments;

            // Position the segment.
            if (i > 0) {
                bend = this.calcBend(t, maxBend);

                const pos = this.positionSegment(bend);
                x += pos.x;
                y += pos.y;
            }

            const index = i * 3 * 3;

            this.updateGeometry(index, x, y, bend);

            this.ablate(dt, x, y, speedMultiplier);
        }

        this.geometry.attributes.position.needsUpdate = true;
        this.geometry.computeVertexNormals();
    }

    updateRotation(dt, speedMultiplier) {
        this.angle += dt * this.speed * this.direction * speedMultiplier;
        this.threeObj.rotation.z = this.angle;
    }

    calcMaxBend(speedMultiplier) {
        const clampedBend = clamp(
            speedMultiplier,
            speedMultiplier * this.bendMin,
            speedMultiplier * this.bendMax
        );

        return (this.speed * -this.direction) * clampedBend;
    }

    calcBend(t, maxBend) {
        let bend = 0;

        if (t > this.flexibleStart) {
            const flexT = (t - this.flexibleStart) / (1 - this.flexibleStart);

            bend =
                (1 - Math.cos(flexT * Math.PI / 2)) *
                maxBend;
        }

        return bend;
    }

    positionSegment(bend) {
        const segmentLength = this.length / this.segments;

        return {
            x: Math.cos(bend) * segmentLength,
            y: Math.sin(bend) * segmentLength
        };
    }

    ablate(dt, x, y, speedMultiplier) {
        const angularVelocity =
            -this.speed * this.direction * speedMultiplier;

        this.tip.x = x;
        this.tip.y = y;

        this.threeObj.localToWorld(this.tip);

        this.ablation.emit(
            this.tip.x,
            this.tip.y,
            angularVelocity
        );

        this.ablation.update(dt);
    }

    addAblation(a, scene) {
        this.ablation = a;
        //this.ablation.setColor(this.color);
        scene.add(a.native);
    }
}
