
export const flashShader = {
    vertex: `
        varying vec3 vNormal;
        varying vec3 vPosition;

        void main() {
            vNormal = normalize(normalMatrix * normal);
            vPosition = position;

            gl_Position = projectionMatrix *
                          modelViewMatrix *
                          vec4(position, 1.0);
        }
    `,

    fragment: `
        uniform vec3 uColor;

        varying vec3 vNormal;
        varying vec3 vPosition;

        // Procedural 3D noise
        float hash(vec3 p) {
            p = fract(p * 0.3183099 + 0.1);
            p *= 17.0;
            return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
        }

        float noise(vec3 p) {
            vec3 i = floor(p);
            vec3 f = fract(p);

            f = f * f * (3.0 - 2.0 * f);

            return mix(
                mix(
                    mix(hash(i), hash(i + vec3(1,0,0)), f.x),
                    mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x),
                    f.y
                ),
                mix(
                    mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
                    mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x),
                    f.y
                ),
                f.z
            );
        }

        void main() {
            vec3 normal = normalize(vNormal);
            vec3 position = normalize(vPosition);

            // Turbulent surface
            float turbulence = noise(position * 9.0);
            turbulence += noise(position * 18.0) * 0.5;

            // Irregular electrical corona
            float corona = pow(turbulence, 2.5);
            corona *= 1.0 + noise(position * 35.0) * 1.5;

            // Surface lighting
            vec3 lightDirection = normalize(vec3(-0.4, 0.6, 1.0));
            float diffuse = max(dot(normal, lightDirection), 0.0);

            // Bright, hot centre
            float hotCore = pow(max(diffuse, 0.0), 0.6);

            // Irregular glowing edges
            float rim = pow(
                1.0 - max(dot(normal, vec3(0.0, 0.0, 1.0)), 0.0),
                2.0
            );

            // Combine palette colour and white-hot energy
            vec3 colour = uColor * (0.3 + diffuse * 0.7);
            colour += uColor * corona * 1.8;
            colour += mix(uColor, vec3(1.0), 0.85) * rim * 0.8;
            colour += vec3(1.0) * hotCore * 0.5;

            gl_FragColor = vec4(colour, 1.0);
        }
    `
};
