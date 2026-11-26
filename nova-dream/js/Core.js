
import {
    Group, IcosahedronGeometry, ShaderMaterial, FrontSide,
    DoubleSide, AdditiveBlending, Mesh 
} from 'three';
import { coreShader } from './shaders/core.js';
import { shellShader } from './shaders/shell.js';

// ==========================================
// SUPERNOVA — CENTRAL ENERGY CORE
// ==========================================

export default class Core {
    constructor(scene, pm) {
        this.scene = scene;
        this.paletteManager = pm;
        this.time = 0;

        const coreColors = this.paletteManager.getSystemColors('core');
        const shellColors = this.paletteManager.getSystemColors('shell');

        this.uniforms = {
            uTime: { value: 0 },
            uEnergy: { value: 0.5 },
            uDistortion: { value: 1.0 },
            uColorShift: { value: 0.0 },
            uBrightness: { value: 1.0 },

            uCoreColorA: { value: coreColors[0].clone() },
            uCoreColorB: { value: coreColors[1].clone() },
            uCoreColorC: { value: coreColors[2].clone() },

            uShellColorA: { value: shellColors[0].clone() },
            uShellColorB: { value: shellColors[1].clone() },
            uShellColorC: { value: shellColors[2].clone() }
        };

        this.group = new Group();

        this.createCore();
        this.createOuterShell();

        this.scene.add(this.group);
    }

    // ======================================
    // MAIN CORE
    // ======================================

    createCore() {
        const geometry = new IcosahedronGeometry(1.0, 96);

        const material = new ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader: coreShader.vertex,
            fragmentShader: coreShader.fragment,
            side: FrontSide
        });

        this.mesh = new Mesh(geometry, material);

        this.group.add(this.mesh);
    }

    // ======================================
    // OUTER SHELL
    // ======================================

    createOuterShell() {
        const geometry = new IcosahedronGeometry(2.4, 64);

        const material = new ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader: shellShader.vertex,
            fragmentShader: shellShader.fragment,

            transparent: true,
            depthWrite: false,
            side: DoubleSide,
            blending: AdditiveBlending
        });

        this.shell = new Mesh(geometry, material);

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

        this.updatePalette();
    }

    // ======================================
    // PALETTE CONTROL
    // ======================================

updatePalette() {

    const core = this.paletteManager.getSystemColors('core');
    const shell = this.paletteManager.getSystemColors('shell');

    this.uniforms.uCoreColorA.value.copy(core[0]);
    this.uniforms.uCoreColorB.value.copy(core[1]);
    this.uniforms.uCoreColorC.value.copy(core[2]);

    this.uniforms.uShellColorA.value.copy(shell[0]);
    this.uniforms.uShellColorB.value.copy(shell[1]);
    this.uniforms.uShellColorC.value.copy(shell[2]);
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
