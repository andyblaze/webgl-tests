
export const flashShader = {
    vertex: `
        uniform float uExplosion;

        varying vec3 vNormal;
        varying vec3 vLocalPosition;
        varying float vNoise;

        // Pseudo-random 3D noise
        vec3 hash3(vec3 p) {
            p = vec3(
                dot(p, vec3(127.1, 311.7, 74.7)),
                dot(p, vec3(269.5, 183.3, 246.1)),
                dot(p, vec3(113.5, 271.9, 124.6))
            );

            return -1.0 + 2.0 * fract(sin(p) * 43758.5453);
        }

        float noise(vec3 p) {
            vec3 i = floor(p);
            vec3 f = fract(p);

            f = f * f * (3.0 - 2.0 * f);

            return mix(
                mix(
                    mix(dot(hash3(i), f),
                        dot(hash3(i + vec3(1.0, 0.0, 0.0)), f - vec3(1.0, 0.0, 0.0)), f.x),
                    mix(
                        dot(hash3(i + vec3(0.0, 1.0, 0.0)), f - vec3(0.0, 1.0, 0.0)),
                        dot(hash3(i + vec3(1.0, 1.0, 0.0)), f - vec3(1.0, 1.0, 0.0)),
                        f.x
                    ),
                    f.y
                ),
                mix(
                    mix(
                        dot(hash3(i + vec3(0.0, 0.0, 1.0)), f - vec3(0.0, 0.0, 1.0)),
                        dot(hash3(i + vec3(1.0, 0.0, 1.0)), f - vec3(1.0, 0.0, 1.0)),
                        f.x
                    ),
                    mix(
                        dot(hash3(i + vec3(0.0, 1.0, 1.0)), f - vec3(0.0, 1.0, 1.0)),
                        dot(hash3(i + vec3(1.0, 1.0, 1.0)), f - vec3(1.0, 1.0, 1.0)),
                        f.x
                    ),
                    f.y
                ),
                f.z
            );
        }

        void main() {
            vec3 direction = normalize(position);

            // Turbulent surface variation
            float n = noise(direction * 7.0);
            float detail = noise(direction * 15.0);

            // Concentrate displacement into irregular outward spikes
            float spikes = pow(max(n + detail * 0.35 - 0.15, 0.0), 2.0);

            float displacement = uExplosion * spikes * 0.045;

            vec3 displacedPosition = position + direction * displacement;

            vNoise = n + detail * 0.35;
            vLocalPosition = direction;

            vNormal = normalize(normalMatrix * normal);

            gl_Position = projectionMatrix *
                          modelViewMatrix *
                          vec4(displacedPosition, 1.0);
        }
    `,

    fragment: `
        uniform vec3 uColor;
        uniform float uExplosion;

        varying vec3 vNormal;
        varying vec3 vLocalPosition;
        varying float vNoise;

        // Fragment noise for irregular plasma patches
        float hash(vec3 p) {
            return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453);
        }

        float noise(vec3 p) {
            vec3 i = floor(p);
            vec3 f = fract(p);

            f = f * f * (3.0 - 2.0 * f);

            float a = hash(i);
            float b = hash(i + vec3(1.0, 0.0, 0.0));
            float c = hash(i + vec3(0.0, 1.0, 0.0));
            float d = hash(i + vec3(1.0, 1.0, 0.0));

            float e = hash(i + vec3(0.0, 0.0, 1.0));
            float f1 = hash(i + vec3(1.0, 0.0, 1.0));
            float g = hash(i + vec3(0.0, 1.0, 1.0));
            float h = hash(i + vec3(1.0, 1.0, 1.0));

            return mix(
                mix(mix(a, b, f.x), mix(c, d, f.x), f.y),
                mix(mix(e, f1, f.x), mix(g, h, f.x), f.y),
                f.z
            );
        }

        void main() {
            vec3 normal = normalize(vNormal);
            vec3 lightDirection = normalize(vec3(-0.4, 0.6, 1.0));

            float diffuse = max(dot(normal, lightDirection), 0.0);
            float rim = pow(
                1.0 - max(dot(normal, vec3(0.0, 0.0, 1.0)), 0.0),
                2.0
            );

            // Original sphere lighting
            vec3 colour = uColor * (0.4 + diffuse * 0.8);
            colour += uColor * rim * 0.5;

            // Irregular, jagged plasma patches
            float turbulence = noise(vLocalPosition * 20.0 + vec3(3.7));
            float patches = smoothstep(0.42, 0.78, turbulence + vNoise * 0.3);

            // Bright electrical regions become stronger during explosion
            float energy = patches * uExplosion;

            colour *= 1.0 + energy * 1.5;
            colour = mix(colour, vec3(1.0), energy * 0.85);

            gl_FragColor = vec4(colour, 1.0);
        }
    `
};
