
import * as THREE from 'three';

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
            uBrightness: { value: 1.0 }
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

            vertexShader: `

                uniform float uTime;
                uniform float uEnergy;
                uniform float uDistortion;

                varying vec3 vPosition;
                varying vec3 vNormal;
                varying vec3 vViewPosition;
                varying float vDisplacement;

                // 3D procedural hash
                vec3 hash33(vec3 p) {

                    p = vec3(
                        dot(p, vec3(127.1, 311.7, 74.7)),
                        dot(p, vec3(269.5, 183.3, 246.1)),
                        dot(p, vec3(113.5, 271.9, 124.6))
                    );

                    return -1.0 + 2.0 * fract(sin(p) * 43758.5453);
                }

                // 3D value noise
                float noise3D(vec3 p) {

                    vec3 i = floor(p);
                    vec3 f = fract(p);

                    vec3 u = f * f * (3.0 - 2.0 * f);

                    return mix(
                        mix(
                            mix(
                                dot(hash33(i + vec3(0,0,0)), f - vec3(0,0,0)),
                                dot(hash33(i + vec3(1,0,0)), f - vec3(1,0,0)),
                                u.x
                            ),
                            mix(
                                dot(hash33(i + vec3(0,1,0)), f - vec3(0,1,0)),
                                dot(hash33(i + vec3(1,1,0)), f - vec3(1,1,0)),
                                u.x
                            ),
                            u.y
                        ),
                        mix(
                            mix(
                                dot(hash33(i + vec3(0,0,1)), f - vec3(0,0,1)),
                                dot(hash33(i + vec3(1,0,1)), f - vec3(1,0,1)),
                                u.x
                            ),
                            mix(
                                dot(hash33(i + vec3(0,1,1)), f - vec3(0,1,1)),
                                dot(hash33(i + vec3(1,1,1)), f - vec3(1,1,1)),
                                u.x
                            ),
                            u.y
                        ),
                        u.z
                    );
                }

                void main() {

                    vec3 p = position;

                    float t = uTime * 0.35;

                    // Layered procedural noise
                    float n1 = noise3D(
                        p * 1.5 + vec3(t, 0.0, 0.0)
                    );

                    float n2 = noise3D(
                        p * 3.5 - vec3(0.0, t * 1.4, 0.0)
                    );

                    float n3 = noise3D(
                        p * 7.0 + vec3(0.0, 0.0, t * 1.8)
                    );

                    float displacement =
                        n1 * 0.28 +
                        n2 * 0.12 +
                        n3 * 0.045;

                    displacement *= uDistortion;
                    displacement *= (0.8 + uEnergy * 0.8);

                    // Pulsating core
                    float pulse = sin(uTime * 1.5) * 0.06;

                    p += normal * (displacement + pulse);

                    vDisplacement = displacement;

                    vPosition = p;
                    vNormal = normalize(normalMatrix * normal);

                    // View-space position
                    vec4 mvPosition = modelViewMatrix *
                        vec4(p, 1.0);

                    vViewPosition = -mvPosition.xyz;

                    gl_Position = projectionMatrix * mvPosition;
                }
            `,

            fragmentShader: `

                uniform float uTime;
                uniform float uEnergy;
                uniform float uColorShift;
                uniform float uBrightness;

                varying vec3 vPosition;
                varying vec3 vNormal;
                varying vec3 vViewPosition;
                varying float vDisplacement;

                // Animated colour palette
                vec3 palette(float t) {

                    vec3 a = vec3(0.5, 0.5, 0.5);
                    vec3 b = vec3(0.5, 0.5, 0.5);
                    vec3 c = vec3(1.0, 1.0, 1.0);

                    vec3 d = vec3(
                        0.00,
                        0.15,
                        0.25
                    );

                    return a + b * cos(
                        6.28318 * (c * t + d)
                    );
                }

                void main() {

                    // Animated colour field
                    float colourFlow =
                        vDisplacement * 2.0 +
                        length(vPosition) * 0.35 -
                        uTime * 0.12 +
                        uColorShift;

                    vec3 col = palette(colourFlow);

                    // Electric energy lines
                    float energyLines = pow(
                        abs(sin(colourFlow * 8.0)),
                        8.0
                    );

                    col += vec3(0.0, 0.7, 1.0) *
                        energyLines * 0.8;

                    // Fresnel illumination
                    vec3 normal = normalize(vNormal);
                    vec3 viewDir = normalize(vViewPosition);

                    float fresnel = pow(
                        1.0 - abs(dot(normal, viewDir)),
                        2.5
                    );

                    col += vec3(1.0, 0.1, 0.65) *
                        fresnel * 1.5;

                    // Energy and brightness
                    col *= uBrightness;
                    col *= 0.8 + uEnergy * 0.8;

                    gl_FragColor = vec4(col, 1.0);
                }
            `,

            side: THREE.FrontSide
        });

        this.mesh = new THREE.Mesh(
            geometry,
            material
        );

        this.group.add(this.mesh);
    }

    // ======================================
    // OUTER SHELL
    // ======================================

    createOuterShell() {

        const geometry = new THREE.IcosahedronGeometry(
            2.12,
            64
        );

        const material = new THREE.ShaderMaterial({

            uniforms: this.uniforms,

            vertexShader: `

                varying vec3 vNormal;
                varying vec3 vViewPosition;

                void main() {

                    vec4 mvPosition = modelViewMatrix *
                        vec4(position, 1.0);

                    vNormal = normalize(normalMatrix * normal);
                    vViewPosition = -mvPosition.xyz;

                    gl_Position = projectionMatrix * mvPosition;
                }
            `,

            fragmentShader: `

                uniform float uTime;
                uniform float uEnergy;

                varying vec3 vNormal;
                varying vec3 vViewPosition;

                void main() {

                    vec3 viewDir = normalize(vViewPosition);

                    float fresnel = pow(
                        1.0 - abs(dot(normalize(vNormal), viewDir)),
                        3.0
                    );

                    vec3 colour = mix(
                        vec3(0.0, 0.8, 1.0),
                        vec3(1.0, 0.0, 0.7),
                        sin(uTime * 0.4) * 0.5 + 0.5
                    );

                    float alpha = fresnel *
                        (0.12 + uEnergy * 0.16);

                    gl_FragColor = vec4(
                        colour,
                        alpha
                    );
                }
            `,

            transparent: true,
            depthWrite: false,
            side: THREE.BackSide,
            blending: THREE.AdditiveBlending
        });

        this.shell = new THREE.Mesh(
            geometry,
            material
        );

        this.group.add(this.shell);
    }

    // ======================================
    // UPDATE
    // ======================================

    update(dt) {

        this.time += dt;

        this.uniforms.uTime.value = this.time;

        // Gentle organic rotation
        this.group.rotation.y += dt * 0.08;
        this.group.rotation.x += dt * 0.035;

        // Slow breathing
        const breathing = 1.0 +
            Math.sin(this.time * 0.8) * 0.025;

        this.group.scale.setScalar(breathing);

        // Outer shell movement
        this.shell.rotation.y = -this.time * 0.05;
        this.shell.rotation.z = this.time * 0.025;
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
