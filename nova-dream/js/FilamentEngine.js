import * as THREE from 'three';
import { filamentShader } from './shaders/filament.js';
import Filament from './Filament.js';

// ==========================================
// SUPERNOVA — FILAMENT ENGINE
// ==========================================
export default class FilamentEngine {

    constructor(scene) {
        this.scene = scene;
        this.time = 0;
        this.setParams();
        this.setUniforms();

        this.group = new THREE.Group();
        this.material = this.createMaterial();

        this.filaments = [];
        this.createFilaments();
        this.scene.add(this.group);
    }
    setParams() {
        this.params = {
            count: 8,
            segments: 160,
            radialSegments: 7,

            minRadius: 1.0,
            maxRadius: 1.5,

            minThickness: 0.012,
            maxThickness: 0.025,

            turns: 1,
            verticalSpread: 1.3
        };
    }
    setUniforms() {
        // Shader uniforms
        this.uniforms = {
            uTime: { value: 0 },
            uEnergy: { value: 0.5 },
            uBrightness: { value: 1.0 },

            uColorA: {
                value: new THREE.Color('#fffb00')
            },
            uColorB: {
                value: new THREE.Color('#ffa32b')
            },
            uColorC: {
                value: new THREE.Color('#ff3232')
            }
        };
    }
    // ======================================
    // SHARED SHADER MATERIAL
    // ======================================
    createMaterial() {
        return new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader: filamentShader.vertex,
            fragmentShader: filamentShader.fragment,
            transparent: true,
            depthWrite: false,
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending,
            toneMapped: false
        });
    }
    // ======================================
    // GENERATE FILAMENTS
    // ======================================
    createFilaments() {
        for (let i = 0; i < this.params.count; i++) {
            const filament = Filament.create(i, this.params, this.material);
            this.filaments.push(filament);
            this.group.add(filament.mesh);
        }
    }
    // ======================================
    // ANIMATION
    // ======================================
    update(dt) {
        this.time += dt;

        this.uniforms.uTime.value = this.time;
        //this.markerCoreMaterial.uniforms.uTime.value += dt;
        //this.trailMaterial.uniforms.uTime.value += dt;        

        // Gentle overall movement
        this.group.rotation.y += dt * 0.018;
        this.group.rotation.x = Math.sin(this.time * 0.12) * 0.035;

        // Move each orange energy marker
        for ( const filament of this.filaments ) {
            filament.progress +=
                filament.speed *
                dt *
                filament.direction;

            // Reverse at either end of the filament
            if (filament.progress >= 1.0) {
                filament.progress = 1.0;
                filament.direction = -1;
            }

            if (filament.progress <= 0.0) {
                filament.progress = 0.0;
                filament.direction = 1;
            }
            // Follow the actual curved filament path
            filament.marker.position.copy(
                filament.curve.getPointAt(
                    filament.progress
                )
            );
            filament.trail.position.copy(
                filament.curve.getPointAt(
                    filament.progress
                )
            );
            //Trail.update(filament);
            //Trail.updateMaterial(dt);
            //this.updateTrail(filament);
        }
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
