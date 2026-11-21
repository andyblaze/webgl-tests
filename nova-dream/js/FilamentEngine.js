
import * as THREE from 'three';
import { filamentShader } from './shaders/filament.js';
import { trailShader } from './shaders/trail.js';
import { markerShader } from './shaders/marker.js';

class Trail {
    
    static material = new THREE.ShaderMaterial({
        uniforms: {
            uTime: { value: 0 }
        },
        vertexShader: trailShader.vertex,
        fragmentShader: trailShader.fragment,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        toneMapped: false
    });

    static pointCount = 40;
    static length = 0.13;

    static geometry = new THREE.BufferGeometry();

    static create(curve) {
        const count = this.pointCount;

        //const geometry = new THREE.BufferGeometry();

        const positions = new Float32Array(count * 3);
        const progress = new Float32Array(count);

        for (let i = 0; i < count; i++) {
            progress[i] = i / (count - 1);
        }

        this.geometry.setAttribute(
            'position',
            new THREE.BufferAttribute(positions, 3)
        );

        this.geometry.setAttribute(
            'aTrailProgress',
            new THREE.BufferAttribute(progress, 1)
        );

        const trail = new THREE.Points(
            this.geometry,
            this.material
        );

        trail.frustumCulled = false;

        return trail;
    }
    static update(filament) {

        const positions = this.geometry.attributes.position;
        const count = this.pointCount;

        for (let i = 0; i < count; i++) {
            const t = i / (count - 1);

            // Sample backwards from the moving marker
            const trailProgress =
                filament.progress -
                filament.direction * this.length * t;

            const clampedProgress = THREE.MathUtils.clamp(trailProgress, 0, 1);

            const point = filament.curve.getPointAt(clampedProgress);

            positions.setXYZ(i, point.x, point.y, point.z);
        }

        positions.needsUpdate = true;
    }
    static updateMaterial(dt) {
        this.material.uniforms.uTime.value += dt;
    }
}

// ==========================================
// SUPERNOVA — FILAMENT ENGINE
// ==========================================

export default class FilamentEngine {

    constructor(scene) {

        this.scene = scene;
        this.time = 0;

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


this.trailMaterial = new THREE.ShaderMaterial({
    uniforms: {
        uTime: { value: 0 }
    },
    vertexShader: trailShader.vertex,
    fragmentShader: trailShader.fragment,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    toneMapped: false
});

this.trailPointCount = 40;
this.trailLength = 0.13;

        this.filaments = [];

        this.createFilaments();

        this.scene.add(this.group);
    }

createTrail(curve) {
    const count = this.trailPointCount;

    const geometry = new THREE.BufferGeometry();

    const positions = new Float32Array(count * 3);
    const progress = new Float32Array(count);

    for (let i = 0; i < count; i++) {
        progress[i] = i / (count - 1);
    }

    geometry.setAttribute(
        'position',
        new THREE.BufferAttribute(positions, 3)
    );

    geometry.setAttribute(
        'aTrailProgress',
        new THREE.BufferAttribute(progress, 1)
    );

    const trail = new THREE.Points(
        geometry,
        this.trailMaterial
    );

    trail.frustumCulled = false;

    return trail;
}

    createMarker() {
        const markerGeometry = new THREE.SphereGeometry(0.055, 16, 16);

        const markerCoreMaterial = new THREE.ShaderMaterial({
            uniforms: { uTime: { value: 0 } },
            vertexShader: markerShader.vertex,
            fragmentShader: markerShader.fragment,
            toneMapped: false
        });
        // Marker group
        const marker = new THREE.Group();

        const markerCore = new THREE.Mesh(
            markerGeometry,
            markerCoreMaterial
        );

        marker.add(markerCore);
        return marker;
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
            this.group.add(filament.mesh);
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
        // Marker group
        const marker = this.createMarker();
        //const trail = Trail.create(curve);
        //marker.add(trail);

        // Attach marker to filament mesh
        mesh.add(marker);

        const trail = Trail.create(curve);//this.createTrail(curve);
        mesh.add(trail);

        // Initial position along curve
        const progress = Math.random();

        const speed = THREE.MathUtils.randFloat(
            0.035,
            0.09
        );

        const direction = Math.random() < 0.5 ? 1 : -1;

        marker.position.copy(curve.getPointAt(progress));     
        trail.position.copy(curve.getPointAt(progress));  

        // Give each filament its own orientation
        mesh.rotation.set(
            THREE.MathUtils.randFloatSpread(0.6),
            0,//THREE.MathUtils.randFloatSpread(Math.PI * 2),
            THREE.MathUtils.randFloatSpread(0.6)
        );

        return { mesh, curve, marker, trail,
            progress, speed, direction };
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


updateTrail(filament) {
    const positions = filament.trail.geometry.attributes.position;
    const count = this.trailPointCount;

    for (let i = 0; i < count; i++) {
        const t = i / (count - 1);

        // Sample backwards from the moving marker
        const trailProgress =
            filament.progress -
            filament.direction * this.trailLength * t;

        const clampedProgress = THREE.MathUtils.clamp(
            trailProgress,
            0,
            1
        );

        const point = filament.curve.getPointAt(clampedProgress);

        positions.setXYZ(i, point.x, point.y, point.z);
    }

    positions.needsUpdate = true;
}


update(dt) {

    this.time += dt;

    this.uniforms.uTime.value = this.time;
    //this.markerCoreMaterial.uniforms.uTime.value += dt;
    //this.trailMaterial.uniforms.uTime.value += dt;
    

    // Gentle overall movement
    this.group.rotation.y += dt * 0.018;

    this.group.rotation.x =
        Math.sin(this.time * 0.12) * 0.035;

    // Move each orange energy marker
    for (const filament of this.filaments) {

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
