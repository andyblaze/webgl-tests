
import * as THREE from 'three';
import { coreShader } from './shaders/core.js';
import { shellShader } from './shaders/shell.js';

// ==========================================
// SUPERNOVA — CENTRAL ENERGY CORE
// ==========================================

export class Core {
    constructor(scene) {
        this.scene = scene;
        this.time = 0;

        this.uniforms = {
            uTime: { value: 0 },
            uEnergy: { value: 0.5 },
            uDistortion: { value: 1.0 },
            uColorShift: { value: 0.0 },
            uBrightness: { value: 1.0 },

            // CORE PALETTE
            uCoreColorA: { value: new THREE.Color('#ff2600') },
            uCoreColorB: { value: new THREE.Color('#ff9d00') },
            uCoreColorC: { value: new THREE.Color('#fff3b0') },

            // SHELL PALETTE
            uShellColorA: { value: new THREE.Color('#ff00cc') },
            uShellColorB: { value: new THREE.Color('#7200ff') },
            uShellColorC: { value: new THREE.Color('#00d9ff') }
        };

        this.group = new THREE.Group();

        this.createCore();
        this.createOuterShell();

        this.scene.add(this.group);
    }

    // ======================================
    // MAIN CORE
    // ======================================

    createCore() {
        const geometry = new THREE.IcosahedronGeometry(2.0, 96);

        const material = new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader: coreShader.vertex,
            fragmentShader: coreShader.fragment,
            side: THREE.FrontSide
        });

        this.mesh = new THREE.Mesh(geometry, material);

        this.group.add(this.mesh);
    }

    // ======================================
    // OUTER SHELL
    // ======================================

    createOuterShell() {
        const geometry = new THREE.IcosahedronGeometry(2.12, 64);

        const material = new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader: shellShader.vertex,
            fragmentShader: shellShader.fragment,

            transparent: true,
            depthWrite: false,
            side: THREE.BackSide,
            blending: THREE.AdditiveBlending
        });

        this.shell = new THREE.Mesh(geometry, material);

        this.group.add(this.shell);
    }

    // ======================================
    // UPDATE
    // ======================================

    update(dt) {
        this.time += dt;
        this.uniforms.uTime.value = this.time;

        this.group.rotation.x += dt * 0.031;
        this.group.rotation.y += dt * 0.08;
        this.group.rotation.z += dt * 0.023;

        const breathing = 1.0 + Math.sin(this.time * 0.8) * 0.025;

        this.group.scale.setScalar(breathing);

        this.shell.rotation.x = -this.time * 0.11;
        this.shell.rotation.y = -this.time * 0.07;
        this.shell.rotation.z = this.time * 0.029;
    }

    // ======================================
    // PALETTE CONTROL
    // ======================================

    setPalette(palette) {
        if (palette.core) {
            this.uniforms.uCoreColorA.value.set(palette.core[0]);
            this.uniforms.uCoreColorB.value.set(palette.core[1]);
            this.uniforms.uCoreColorC.value.set(palette.core[2]);
        }

        if (palette.shell) {
            this.uniforms.uShellColorA.value.set(palette.shell[0]);
            this.uniforms.uShellColorB.value.set(palette.shell[1]);
            this.uniforms.uShellColorC.value.set(palette.shell[2]);
        }
    }

    // ======================================
    // PUBLIC PARAMETERS
    // ======================================

    setEnergy(value) {
        this.uniforms.uEnergy.value = value;
    }

    setDistortion(value) {
        this.uniforms.uDistortion.value = value;
    }

    setColorShift(value) {
        this.uniforms.uColorShift.value = value;
    }

    setBrightness(value) {
        this.uniforms.uBrightness.value = value;
    }

    // ======================================
    // CLEANUP
    // ======================================

    dispose() {
        this.mesh.geometry.dispose();
        this.mesh.material.dispose();

        this.shell.geometry.dispose();
        this.shell.material.dispose();

        this.scene.remove(this.group);
    }
}
