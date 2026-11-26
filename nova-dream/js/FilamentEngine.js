import { Group, ShaderMaterial, DoubleSide, AdditiveBlending } from 'three';
import { filamentShader } from './shaders/filament.js';
import Filament from './helpers/Filament.js';

// ==========================================
// SUPERNOVA — FILAMENT ENGINE
// ==========================================
export default class FilamentEngine {

    constructor(scene, pm) {
        this.scene = scene;
        this.paletteManager = pm;
        this.time = 0;
        this.setParams();
        this.setUniforms();

        this.group = new Group();
        this.material = this.createMaterial();

        this.filaments = [];
        this.createFilaments();
        this.scene.add(this.group);
    }
    setParams() {
        this.params = {
            count: 5,
            segments: 180,
            radialSegments: 8,

            minRadius: 4.0,
            maxRadius: 5,

            minThickness: 0.028,
            maxThickness: 0.035,

            turns: 1,
            verticalSpread: 1.3
        };
    }
    setUniforms() {
        const colors = this.paletteManager.getSystemColors('filaments');

        this.uniforms = {
            uTime: { value: 0 },
            uEnergy: { value: 0.5 },
            uBrightness: { value: 1.0 },

            uColorA: { value: colors[0].clone() },
            uColorB: { value: colors[1].clone() },
            uColorC: { value: colors[2].clone() }
        };
    }
    // ======================================
    // SHARED SHADER MATERIAL
    // ======================================
    createMaterial() {
        return new ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader: filamentShader.vertex,
            fragmentShader: filamentShader.fragment,
            transparent: true,
            depthWrite: false,
            side: DoubleSide,
            blending: AdditiveBlending,
            toneMapped: false
        });
    }
    // ======================================
    // GENERATE FILAMENTS
    // ======================================
    createFilaments() {
        for (let i = 0; i < this.params.count; i++) {
            const filament = new Filament(i, this.params, this.paletteManager);
            filament.render(this.material);
            this.filaments.push(filament);
            this.group.add(filament.mesh);
        }
    }
    // ======================================
    // ANIMATION
    // ======================================
    update(dt) {
        this.time += dt;  
        this.updatePalette(); 

        // Gentle overall movement
        this.group.rotation.y += dt * 0.028;
        this.group.rotation.x = Math.sin(this.time * 0.12) * 0.035;

        // Move each orange energy marker
        for ( const filament of this.filaments ) {
            filament.update(dt);//filament.progress += filament.speed * dt * filament.direction;
        }
    }
    updatePalette() {
        const colors = this.paletteManager.getSystemColors('filaments');

        this.uniforms.uColorA.value.copy(colors[0]);
        this.uniforms.uColorB.value.copy(colors[1]);
        this.uniforms.uColorC.value.copy(colors[2]);
    }
    // ======================================
    // CONTROLS
    // ======================================
    setEnergy(value) {
        this.uniforms.uEnergy.value = value;
    }
    setBrightness(value) {
        this.uniforms.uBrightness.value = value;
    }
    setPalette(colors) {
        this.uniforms.uColorA.value.set(colors[0]);
        this.uniforms.uColorB.value.set(colors[1]);
        this.uniforms.uColorC.value.set(colors[2]);
    }
    // ======================================
    // CLEANUP
    // ======================================
    dispose() {
        for (const filament of this.filaments) {
            filament.geometry.dispose();
        }
        this.material.dispose();
        this.markerGeometry.dispose();
        //this.markerHaloGeometry.dispose();

        this.markerCoreMaterial.dispose();
        //this.markerHaloMaterial.dispose();
        this.trailMaterial.dispose();
        filament.trail.geometry.dispose();

        this.scene.remove(this.group);
        this.filaments = [];
    }
}
