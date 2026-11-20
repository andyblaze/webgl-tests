
import * as THREE from 'three';
import { filamentShader } from './shaders/filament.js';

// ==========================================
// SUPERNOVA — FILAMENT ENGINE
// ==========================================

export default class FilamentEngine {

    constructor(scene) {

        this.scene = scene;
        this.time = 0;

        this.params = {
            count: 16,
            segments: 160,
            radialSegments: 7,

            minRadius: 1.0,
            maxRadius: 1.5,

            minThickness: 0.012,
            maxThickness: 0.025,

            turns: 1,
            verticalSpread: 1.3
        };

        // Shader uniforms
        this.uniforms = {
            uTime: { value: 0 },
            uEnergy: { value: 0.5 },
            uBrightness: { value: 1.0 },

            uColorA: {
                value: new THREE.Color('#00eaff')
            },

            uColorB: {
                value: new THREE.Color('#8a2bff')
            },

            uColorC: {
                value: new THREE.Color('#ff32bd')
            }
        };

        this.group = new THREE.Group();
        this.material = this.createMaterial();

        this.filaments = [];

        this.createFilaments();

        this.scene.add(this.group);
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

            const filament = this.createFilament(i);

            this.filaments.push(filament);
            this.group.add(filament);
        }
    }


    // ======================================
    // CREATE INDIVIDUAL SPIRAL
    // ======================================

    createFilament(index) {

        const p = this.params;

        const phase = Math.random() * Math.PI * 2;

        const radius = THREE.MathUtils.lerp(
            p.minRadius,
            p.maxRadius,
            Math.random()
        );

        const thickness = THREE.MathUtils.lerp(
            p.minThickness,
            p.maxThickness,
            Math.random()
        );

        const turns = p.turns * THREE.MathUtils.lerp(
            0.7,
            1.5,
            Math.random()
        );

        const verticalSpread = p.verticalSpread *
            THREE.MathUtils.lerp(0.5, 1.4, Math.random());

        const wobble = THREE.MathUtils.lerp(
            0.12,
            0.38,
            Math.random()
        );

        const drift = THREE.MathUtils.lerp(
            -0.8,
            0.8,
            Math.random()
        );

        //const points = [];



const points = [];

// Orbital plane: X and Z
const baseRadius = THREE.MathUtils.lerp(
    p.minRadius,
    p.maxRadius,
    Math.random()
);

const orbitWidth = THREE.MathUtils.randFloat(
    2.5,
    6.1
);

const verticalOffset = THREE.MathUtils.randFloatSpread(0.7);

const verticalWave = THREE.MathUtils.randFloat(
    0.12,
    0.35
);

const orbitPhase = Math.random() * Math.PI * 2;

// Generate an extended elliptical spiral
for (let j = 0; j <= p.segments; j++) {

    const t = j / p.segments;

    const angle =
        orbitPhase +
        t * Math.PI * 2 * turns;

    // Gradual expansion and contraction
    const envelope = Math.sin(Math.PI * t);

    const radius =
        baseRadius +
        orbitWidth * envelope +
        Math.sin(angle * 2.0 + phase) * wobble;

    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius * 0.85;

    // Keep vertical movement subtle
    const y =
        verticalOffset +
        Math.sin(angle * 0.5 + phase) *
        verticalWave;

    points.push(new THREE.Vector3(x, y, z));
}

const curve = new THREE.CatmullRomCurve3(points);



        const geometry = this.createTubeGeometry(
            curve,
            p.segments,
            p.radialSegments,
            thickness,
            index,
            phase
        );

        const mesh = new THREE.Mesh(
            geometry,
            this.material
        );

        // Give each filament its own orientation
        mesh.rotation.set(
            THREE.MathUtils.randFloatSpread(0.6),
            0,//THREE.MathUtils.randFloatSpread(Math.PI * 2),
            THREE.MathUtils.randFloatSpread(0.6)
        );

        return mesh;
    }


    // ======================================
    // CUSTOM TUBE GEOMETRY
    // ======================================

    createTubeGeometry(
        curve,
        segments,
        radialSegments,
        thickness,
        strandIndex,
        phase
    ) {

        const frames = curve.computeFrenetFrames(
            segments,
            false
        );

        const positions = [];
        const progress = [];
        const strand = [];
        const phases = [];
        const indices = [];

        const count = strandIndex;

        for (let i = 0; i <= segments; i++) {

            const t = i / segments;

            const point = curve.getPointAt(t);

            // Slightly tapered, irregular strand thickness
            const taper = Math.sin(Math.PI * t);

            const organicWidth =
                0.85 + 0.15 * Math.sin(t * 18.0 + phase);

            const radius = thickness *
                (0.35 + taper * 0.65) *
                organicWidth;

            const normal = frames.normals[i];
            const binormal = frames.binormals[i];

            for (let j = 0; j <= radialSegments; j++) {

                const angle =
                    (j / radialSegments) * Math.PI * 2;

                const radial = new THREE.Vector3()
                    .copy(normal)
                    .multiplyScalar(Math.cos(angle))
                    .addScaledVector(
                        binormal,
                        Math.sin(angle)
                    );

                const vertex = new THREE.Vector3()
                    .copy(point)
                    .addScaledVector(radial, radius);

                positions.push(
                    vertex.x,
                    vertex.y,
                    vertex.z
                );

                progress.push(t);
                strand.push(count);
                phases.push(phase);
            }
        }

        // Connect the tube rings
        for (let i = 0; i < segments; i++) {

            for (let j = 0; j < radialSegments; j++) {

                const a =
                    i * (radialSegments + 1) + j;

                const b = a + radialSegments + 1;

                indices.push(
                    a, b, a + 1,
                    b, b + 1, a + 1
                );
            }
        }

        const geometry = new THREE.BufferGeometry();

        geometry.setAttribute(
            'position',
            new THREE.Float32BufferAttribute(positions, 3)
        );

        geometry.setAttribute(
            'aProgress',
            new THREE.Float32BufferAttribute(progress, 1)
        );

        geometry.setAttribute(
            'aStrand',
            new THREE.Float32BufferAttribute(strand, 1)
        );

        geometry.setAttribute(
            'aPhase',
            new THREE.Float32BufferAttribute(phases, 1)
        );

        geometry.setIndex(indices);

        geometry.computeVertexNormals();
        geometry.computeBoundingSphere();

        return geometry;
    }


    // ======================================
    // ANIMATION
    // ======================================

    update(dt) {

        this.time += dt;

        this.uniforms.uTime.value = this.time;

        // Very subtle overall movement
        this.group.rotation.y += dt * 0.018;
        this.group.rotation.x =
            Math.sin(this.time * 0.12) * 0.035;
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

        this.scene.remove(this.group);

        this.filaments = [];
    }
}
