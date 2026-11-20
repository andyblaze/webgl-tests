
export const shellShader = {

    vertex: `
        varying vec3 vPosition;
        varying vec3 vNormal;
        varying vec3 vViewPosition;

        void main() {
            vPosition = position;

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

        varying vec3 vPosition;
        varying vec3 vNormal;
        varying vec3 vViewPosition;


        // =====================================
        // 3D PROCEDURAL NOISE
        // =====================================

        float hash31(vec3 p) {
            p = fract(p * 0.1031);
            p += dot(p, p.yzx + 33.33);
            return fract((p.x + p.y) * p.z);
        }

        float noise3D(vec3 p) {
            vec3 i = floor(p);
            vec3 f = fract(p);

            f = f * f * (3.0 - 2.0 * f);

            float n000 = hash31(i);
            float n100 = hash31(i + vec3(1.0, 0.0, 0.0));
            float n010 = hash31(i + vec3(0.0, 1.0, 0.0));
            float n110 = hash31(i + vec3(1.0, 1.0, 0.0));

            float n001 = hash31(i + vec3(0.0, 0.0, 1.0));
            float n101 = hash31(i + vec3(1.0, 0.0, 1.0));
            float n011 = hash31(i + vec3(0.0, 1.0, 1.0));
            float n111 = hash31(i + vec3(1.0, 1.0, 1.0));

            float x00 = mix(n000, n100, f.x);
            float x10 = mix(n010, n110, f.x);
            float x01 = mix(n001, n101, f.x);
            float x11 = mix(n011, n111, f.x);

            return mix(
                mix(x00, x10, f.y),
                mix(x01, x11, f.y),
                f.z
            );
        }


        // =====================================
        // SHELL SURFACE
        // =====================================

        void main() {

            float t = uTime * 0.18;

            // Slowly moving, warped coordinates
            vec3 p = vPosition * 1.5;

            float warp = noise3D(p * 1.3 + vec3(t, 0.0, -t));

            p += vec3(
                warp * 0.8,
                sin(p.z * 1.5 + t) * 0.3,
                cos(p.x * 1.5 - t) * 0.3
            );

            // Large organic colour regions
            float regions = noise3D(
                p * 1.4 + vec3(-t, t * 0.7, t * 0.4)
            );

            // Secondary movement within the regions
            float flow = noise3D(
                p * 2.8 + vec3(t * 1.4, -t, t * 0.8)
            );

            float pattern = regions * 0.7 + flow * 0.3;

            // Three-colour transitions
            vec3 colour = mix(
                uShellColorA,
                uShellColorB,
                smoothstep(0.25, 0.7, pattern)
            );

            colour = mix(
                colour,
                uShellColorC,
                smoothstep(0.55, 0.85, flow)
            );


            // =================================
            // FLOWING ENERGY CURRENTS
            // =================================

            float currentField =
                p.x * 2.0 +
                p.y * 1.3 +
                p.z * 1.7 +
                flow * 5.0 -
                uTime * 0.8;

            float currents = pow(
                1.0 - abs(sin(currentField)),
                10.0
            );

            vec3 currentColour = mix(
                uShellColorC,
                vec3(1.0),
                0.45
            );

            colour += currentColour * currents * 1.5;


            // =================================
            // LUMINOUS OUTER RIM
            // =================================

            vec3 normal = normalize(vNormal);
            vec3 viewDir = normalize(vViewPosition);

            float fresnel = pow(
                1.0 - abs(dot(normal, viewDir)),
                2.5
            );

            colour += uShellColorC * fresnel * 0.8;


            // =================================
            // TRANSPARENCY & ENERGY
            // =================================

            float alpha =
                0.5512 +
                pattern * 0.08 +
                currents * 0.2 +
                fresnel * 0.12;

            alpha *= 0.8 + uEnergy * 0.4;

            gl_FragColor = vec4(colour, alpha);
        }
    `
};
