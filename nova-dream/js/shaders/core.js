
export const coreShader = {
    vertex: `

        uniform float uTime;
        uniform float uEnergy;
        uniform float uDistortion;

        varying vec3 vPosition;
        varying vec3 vNormal;
        varying vec3 vViewPosition;
        varying float vDisplacement;

        vec3 hash33(vec3 p) {
            p = vec3(
                dot(p, vec3(127.1, 311.7, 74.7)),
                dot(p, vec3(269.5, 183.3, 246.1)),
                dot(p, vec3(113.5, 271.9, 124.6))
            );

            return -1.0 + 2.0 * fract(sin(p) * 43758.5453);
        }

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

            float pulse = sin(uTime * 1.5) * 0.06;

            p += normal * (displacement + pulse);

            vDisplacement = displacement;
            vPosition = p;
            vNormal = normalize(normalMatrix * normal);

            vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);

            vViewPosition = -mvPosition.xyz;

            gl_Position = projectionMatrix * mvPosition;
        }
    `,

    fragment: `

        uniform float uTime;
        uniform float uEnergy;
        uniform float uColorShift;
        uniform float uBrightness;

        uniform vec3 uCoreColorA;
        uniform vec3 uCoreColorB;
        uniform vec3 uCoreColorC;

        varying vec3 vPosition;
        varying vec3 vNormal;
        varying vec3 vViewPosition;
        varying float vDisplacement;

        // Three-colour animated palette
        vec3 palette(float t) {

            float flow = fract(t);

            vec3 color;

            if (flow < 0.5) {
                color = mix(
                    uCoreColorA,
                    uCoreColorB,
                    smoothstep(0.0, 0.5, flow)
                );
            } else {
                color = mix(
                    uCoreColorB,
                    uCoreColorC,
                    smoothstep(0.5, 1.0, flow)
                );
            }

            return color;
        }

        void main() {

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

            // Derive energy-line colour from the palette
            vec3 electricColour = mix(
                uCoreColorA,
                uCoreColorC,
                0.5 + 0.5 * sin(colourFlow * 3.0)
            );

            col += electricColour * energyLines * 0.8;

            // Fresnel illumination
            vec3 normal = normalize(vNormal);
            vec3 viewDir = normalize(vViewPosition);

            float fresnel = pow(
                1.0 - abs(dot(normal, viewDir)),
                2.5
            );

            vec3 fresnelColour = mix(
                uCoreColorB,
                uCoreColorC,
                0.5
            );

            col += fresnelColour * fresnel * 1.5;

            col *= uBrightness;
            col *= 0.8 + uEnergy * 0.8;

            gl_FragColor = vec4(col, 1.0);
        }
    `
};
