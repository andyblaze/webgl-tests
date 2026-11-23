
import * as THREE from 'three';
import { flashShader } from './shaders/flash.js';

export default class Flash {
    constructor(index, geometry, paletteManager) {
        this.paletteManager = paletteManager;

        // Orbit properties
        this.radius = THREE.MathUtils.randFloat(1.25, 2.15);
        this.angle = Math.random() * Math.PI * 2;
        this.speed = THREE.MathUtils.randFloat(0.2, 0.7);
        this.inclination = THREE.MathUtils.randFloat(-0.8, 0.8);

        // Colour
        this.colorIndex = Math.floor(Math.random() * 6);

        const color = this.paletteManager.getSystemColors('particles')[this.colorIndex];
        this.baseColor = color.clone();

        // Explosion state (reserved for later)
        this.isExploding = false;
        this.explosionElapsed = 0;
        this.explosionDuration = 1.4;
        this.explosionIntensity = 1;
        this.baseScale = 1;
        this.expansion = 4;
        // Temporary automatic triggering
        this.explosionTimer = 0;
        this.nextExplosion = THREE.MathUtils.randFloat(5, 12);

        // Material
        this.material = new THREE.ShaderMaterial({
            uniforms: {
                uColor: { value: color.clone() }
            },
            vertexShader: flashShader.vertex,
            fragmentShader: flashShader.fragment,
            toneMapped: false
        });

        this.mesh = new THREE.Mesh(geometry, this.material);
        this.mesh.position.set(0, 0, 0);
    }

update(dt) {
    this.angle += this.speed * dt;

    const x = Math.cos(this.angle) * this.radius;
    const y = Math.sin(this.angle) * this.radius * Math.cos(this.inclination);
    const z = Math.sin(this.angle) * this.radius * Math.sin(this.inclination);

    this.mesh.position.set(x, y, z);

    this.updatePalette();

    if (this.isExploding) {
        this.updateExplosion(dt);
    } else {
        this.explosionTimer += dt;

        if (this.explosionTimer >= this.nextExplosion) {
            this.onExplode();
        }
    }
}
updatePalette() {
    const color = this.paletteManager.getSystemColors('particles')[this.colorIndex];

    this.baseColor.copy(color);

    if (!this.isExploding) {
        this.material.uniforms.uColor.value.copy(color);
    }
}

onExplode() {
    this.isExploding = true;
    this.explosionElapsed = 0;
    this.mesh.scale.setScalar(this.baseScale);
}

updateExplosion(dt) {
    this.explosionElapsed += dt;

    const t = Math.min(
        this.explosionElapsed / this.explosionDuration,
        1
    );

    const pulse = Math.sin(t * Math.PI);

    // Scale
    const scale = this.baseScale + pulse * this.expansion;
    this.mesh.scale.setScalar(scale);

    // Colour
    this.material.uniforms.uColor.value
        .copy(this.baseColor)
        .lerp(new THREE.Color(1, 1, 1), pulse);

    if (t >= 1) {
        this.reset();
    }
}

reset() {
    this.isExploding = false;
    this.explosionElapsed = 0;
    this.explosionTimer = 0;
    this.nextExplosion = THREE.MathUtils.randFloat(5, 12);

    this.mesh.scale.setScalar(this.baseScale);
    this.material.uniforms.uColor.value.copy(this.baseColor);
}


    dispose() {
        this.material.dispose();
    }
}
