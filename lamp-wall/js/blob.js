function randomFrom(arr) {
    return arr[mt_rand(0, arr.length - 1)];
}

function mt_rand(min = 0, max = 1) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function mt_randf(min = 0, max = 1) {
    return Math.random() * (max - min) + min;
}
function clamp(mn, mx, val) {
    return Math.max(mn, Math.min(mx, val));
}
const colours = [
    0xff3300, // red
    0xff8800, // orange
    0xffdd00, // yellow
    0x00ff66, // green
    0x00ccff, // cyan
    0x3366ff, // blue
    0xaa33ff, // purple
    0xff33aa  // pink
];

export default class Blob {
    constructor(three, sz) {
        this.blb = new three.Mesh(
        new three.SphereGeometry(sz, 48, 48),
            new three.MeshStandardMaterial({
                color:randomFrom(colours),
                emissive:0xaa2200,
                emissiveIntensity: 0.8,
                roughness:0.35
            })
        );
        this.blb.position.y = mt_randf(-0.5, 0.5);
        
        this.temperature = 0;
        this.velocity = 0;

        this.heatRate = 2 + mt_randf();
        this.coolRate = 2 + mt_randf();
        this.drag = mt_rand(40, 50);
        this.buoyancyFactor = mt_randf(0.01, 0.02);
        this.top = 1.8;
        this.bottom = -2;
        this.boundaryZone = 0.4;   // how far from top/bottom it affects
        this.boundaryDamping = 0.1; // how strong the slowdown is
    }
    update(dt) {
        this.applyPhysics(dt);
        const stretch = 1 + Math.abs(this.velocity) * 48;
        this.blb.scale.y = stretch;
        this.blb.scale.x = 1 / Math.sqrt(stretch);
        this.blb.scale.z = 1 / Math.sqrt(stretch);
    }
    applyPhysics(dt) {
        let targetTemp = this.temperature; // placeholder for now

        if (this.posY < this.bottom)
            targetTemp += this.heatRate * dt;

        if (this.posY > this.top)
            targetTemp -= this.coolRate * dt;

        this.temperature += (targetTemp - this.temperature) * 0.15;
        this.temperature = clamp(0, 1, this.temperature);
        // Buoyancy
        const buoyancy = (this.temperature - 0.5) * this.buoyancyFactor;
        this.velocity += buoyancy;
        // 🧪 NEW: fake boundary density layer
        let boundaryFactor = 1.0;
        // bottom zone
        if (this.posY < this.bottom + this.boundaryZone) {
            const t = (this.posY - this.bottom) / this.boundaryZone; // 0..1
            boundaryFactor *= (this.boundaryDamping + (1 - this.boundaryDamping) * t);
        }
        // top zone
        if (this.posY > this.top - this.boundaryZone) {
            const t = (this.top - this.posY) / this.boundaryZone; // 0..1
            boundaryFactor *= (this.boundaryDamping + (1 - this.boundaryDamping) * t);
        }
        // Drag (now boundary-aware)
        this.velocity *= Math.exp(-this.drag * dt) * boundaryFactor;
        this.posY += this.velocity;
        // Reset cycle (keep your logic)
        if (this.posY > this.top && this.velocity > 0)
            this.velocity *= 0.98;

        if (this.posY < this.bottom && this.velocity < 0)
            this.velocity *= 0.98;
        return this.velocity;
    }
    get posY() {
        return this.blb.position.y;
    }
    set posY(y) {
        this.blb.position.y = y;
    }
    get actual() {
        return this.blb;
    }
}
