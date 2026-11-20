
export const shellShader = {
    vertex: `

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

    fragment: `
        uniform float uTime;
        uniform float uEnergy;

        uniform vec3 uShellColorA;
        uniform vec3 uShellColorB;
        uniform vec3 uShellColorC;

        varying vec3 vNormal;
        varying vec3 vViewPosition;

        void main() {
            vec3 viewDir = normalize(vViewPosition);

            float fresnel = pow(
                1.0 - abs(dot(normalize(vNormal), viewDir)),
                3.0
            );

            // Animated three-colour transition
            float colourFlow = sin(uTime * 0.4) * 0.5 + 0.5;

            vec3 colour;

            if (colourFlow < 0.5) {

                colour = mix(
                    uShellColorA,
                    uShellColorB,
                    smoothstep(0.0, 0.5, colourFlow)
                );

            } else {

                colour = mix(
                    uShellColorB,
                    uShellColorC,
                    smoothstep(0.5, 1.0, colourFlow)
                );
            }

            // Energy-responsive shell brightness
            float alpha = fresnel *
                (0.12 + uEnergy * 0.16);

            gl_FragColor = vec4(
                colour,
                alpha
            );
        }
    `
};
