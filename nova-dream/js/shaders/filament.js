
export const filamentShader = {

    vertex: `
        uniform float uTime;
        uniform float uEnergy;

        attribute float aProgress;
        attribute float aStrand;
        attribute float aPhase;

        varying float vProgress;
        varying float vStrand;
        varying float vPhase;
        varying float vPulse;
        varying vec3 vPosition;

        void main() {

            vProgress = aProgress;
            vStrand = aStrand;
            vPhase = aPhase;

            vec3 p = position;

            // Subtle travelling displacement
            float wave1 = sin(
                aProgress * 18.0 -
                uTime * 2.0 +
                aPhase
            );

            float wave2 = sin(
                aProgress * 31.0 +
                uTime * 1.3 +
                aStrand * 4.0
            );

            float distortion =
                (wave1 * 0.025 + wave2 * 0.012) *
                (0.5 + uEnergy);

            // Displace around the filament's original path
            p += normalize(p) * distortion;

            // Travelling energy pulse
            float pulse = pow(
                max(
                    0.0,
                    sin(
                        aProgress * 12.0 -
                        uTime * 3.0 +
                        aPhase
                    )
                ),
                5.0
            );

            vPulse = pulse;

            vPosition = p;

            gl_Position = projectionMatrix *
                modelViewMatrix *
                vec4(p, 1.0);
        }
    `,

    fragment: `
        uniform float uTime;
        uniform float uEnergy;
        uniform float uBrightness;

        uniform vec3 uColorA;
        uniform vec3 uColorB;
        uniform vec3 uColorC;

        varying float vProgress;
        varying float vStrand;
        varying float vPhase;
        varying float vPulse;
        varying vec3 vPosition;

        void main() {

// =================================
// SEAMLESS COSINE COLOUR FLOW
// =================================

float colourFlow =
    vProgress * 1.8 -
    uTime * 0.12 +
    vStrand * 0.17 +
    vPhase * 0.08;

float wave = cos(colourFlow * 6.28318);

float blend = wave * 0.5 + 0.5;

vec3 colour = mix(
    uColorA,
    uColorB,
    blend
);

colour = mix(
    colour,
    uColorC,
    smoothstep(0.35, 0.9, 1.0 - blend)
);


            // =================================
            // ORGANIC BRIGHTNESS VARIATION
            // =================================

            float turbulence =
                sin(vProgress * 25.0 - uTime * 1.7 + vPhase) *
                cos(vProgress * 13.0 + uTime * 0.8);

            float brightness =
                0.65 + turbulence * 0.2;

            brightness += vPulse * 0.9;

            // Energy amplification
            brightness *= 0.8 + uEnergy * 0.5;

            colour *= brightness;


            // =================================
            // ELECTRICAL HIGHLIGHTS
            // =================================

            vec3 electricColour = mix(
                uColorB,
                uColorC,
                0.5 + 0.5 * sin(
                    vProgress * 18.0 - uTime
                )
            );

            colour += electricColour * vPulse * 0.8;


            // =================================
            // FILAMENT FADING
            // =================================

            float startFade = smoothstep(
                0.0,
                0.08,
                vProgress
            );

            float endFade = 1.0 - smoothstep(
                0.88,
                1.0,
                vProgress
            );

            float alpha =
                startFade *
                endFade *
                (0.55 + vPulse * 0.35);

            alpha *= uBrightness * 0.25;

            gl_FragColor = vec4(colour, alpha);
        }
    `
};
