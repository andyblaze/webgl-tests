import { mt_randf } from "./functions.js";

export default class Ablation {
    constructor(three, maxParticles=160) {
        this.maxParticles = maxParticles;

        this.positions = new Float32Array(maxParticles * 3);
        this.velocities = new Float32Array(maxParticles * 3);
        this.life = new Float32Array(maxParticles);

        const geometry = new three.BufferGeometry();

        geometry.setAttribute(
            "position",
            new three.BufferAttribute(this.positions, 3)
        );

        this.material = new three.PointsMaterial({
            color: 0x000000,
            size: 2,
            sizeAttenuation: false,
            transparent: true,
            opacity: 0.5
        });

        this.threeObj = new three.Points(geometry, this.material);
    }

    get native() {
        return this.threeObj;
    }

    emit(x, y, angularVelocity) {
        for ( let i = 0; i < this.maxParticles; i++ ) {
            if ( this.life[i] > 0 ) continue;

            const index = i * 3;

            const angle = mt_randf(1, 360);
            const speed = mt_randf(0.01, 0.02);

            const vx = -y * angularVelocity;
            const vy =  x * angularVelocity;

            this.velocities[index + 0] = vx * speed;
            this.velocities[index + 1] = vy * speed;
            this.velocities[index + 2] = 0;

            this.positions[index + 0] = x;
            this.positions[index + 1] = y;
            this.positions[index + 2] = 0;

            this.life[i] = mt_randf(20, 30);

            break;
        }

        this.threeObj.geometry.attributes.position.needsUpdate = true;
    }

    update(dt) {
        for ( let i = 0; i < this.maxParticles; i++ ) {
            if ( this.life[i] <= 0 ) continue;

            this.positions[i + 0] += this.velocities[i + 0] * dt;
            this.positions[i + 1] += this.velocities[i + 1] * dt;

            this.life[i] -= dt;
        }
    }
}