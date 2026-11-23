
export const flashShader = {
    vertex: `
        uniform float uExplosion;

        varying vec3 vNormal;
        varying vec3 vLocalPosition;
        varying float vDisplacement;

        // 3D hash
        vec3 hash3(vec3 p) {
            p = vec3(
                dot(p, vec3(127.1, 311.7, 74.7)),
                dot(p, vec3(269.5, 183.3, 246.1)),
                dot(p, vec3(113.5, 271.9, 124.6))
            );

            return -1.0 + 2.0 * fract(sin(p) * 43758.5453);
        }

        // 3D value noise
        float noise(vec3 p) {
            vec3 i = floor(p);
            vec3 f = fract(p);

            f = f * f * (3.0 - 2.0 * f);

            float n000 = dot(hash3(i), f);
            float n100 = dot(hash3(i + vec3(1.0, 0.0, 0.0)), f - vec3(1.0, 0.0, 0.0));
            float n010 = dot(hash3(i + vec3(0.0, 1.0, 0.0)), f - vec3(0.0, 1.0, 0.0));
            float n110 = dot(hash3(i + vec3(1.0, 1.0, 0.0)), f - vec3(1.0, 1.0, 0.0));
            float n001 = dot(hash3(i + vec3(0.0, 0.0, 1.0)), f - vec3(0.0, 0.0, 1.0));
            float n101 = dot(hash3(i + vec3(1.0, 0.0, 1.0)), f - vec3(1.0, 0.0, 1.0));
            float n011 = dot(hash3(i + vec3(0.0, 1.0, 1.0)), f - vec3(0.0, 1.0, 1.0));
            float n111 = dot(hash3(i + vec3(1.0, 1.0, 1.0)), f - vec3(1.0, 1.0, 1.0));

            return mix(
                mix(mix(n000, n100, f.x), mix(n010, n110, f.x), f.y),
                mix(mix(n001, n101, f.x), mix(n011, n111, f.x), f.y),
                f.z
            );
        }

        // Fractal Brownian Motion
        float fbm(vec3 p) {
            float value = 0.0;
            float amplitude = 0.5;

            for (int i = 0; i < 4; i++) {
                value += noise(p) * amplitude;
                p *= 2.0;
                amplitude *= 0.5;
            }

            return value;
        }

        void main() {
            vec3 direction = normalize(position);

            // Broad turbulence plus fine surface detail
            float broad = fbm(direction * 4.0);
            float detail = fbm(direction * 11.0);

            float turbulence = broad * 0.75 + detail * 0.25;

            // Distort the corona's silhouette
            float displacement = (turbulence - 0.15) * 0.045 * uExplosion;

            vec3 displacedPosition = position + direction * displacement;

            vDisplacement = turbulence;
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
        varying float vDisplacement;

        // 3D hash
        float hash(vec3 p) {
            return fract(
                sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453
            );
        }

        // 3D value noise
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

        float fbm(vec3 p) {
            float value = 0.0;
            float amplitude = 0.5;

            for (int i = 0; i < 4; i++) {
                value += noise(p) * amplitude;
                p *= 2.0;
                amplitude *= 0.5;
            }

            return value;
        }

        void main() {
            vec3 normal = normalize(vNormal);
            vec3 lightDirection = normalize(vec3(-0.4, 0.6, 1.0));

            float diffuse = max(dot(normal, lightDirection), 0.0);
            float rim = pow(
                1.0 - max(dot(normal, vec3(0.0, 0.0, 1.0)), 0.0),
                2.0
            );

            // Distorted noise coordinates create turbulent patterns
            vec3 p = vLocalPosition * 7.0;

            vec3 warp = vec3(
                fbm(p + vec3(1.7, 2.3, 0.8)),
                fbm(p + vec3(4.1, 0.6, 2.5)),
                fbm(p + vec3(0.3, 3.8, 1.4))
            );

            float plasma = fbm(p + warp * 2.0);
            float detail = noise(vLocalPosition * 24.0);

            // Break the surface into irregular plasma regions
            float density = plasma + detail * 0.12;

            float patches = smoothstep(0.12, 0.43, density);

            // Colour and brightness
            float lighting = 0.3 + diffuse * 0.5 + rim * 0.4;

            vec3 colour = uColor * lighting;

            // Hotter regions during explosion
            float heat = smoothstep(0.32, 0.55, density) * uExplosion;

            colour = mix(
                colour,
                vec3(1.0, 0.85, 0.65),
                heat * 0.75
            );

            // Slightly brighter turbulent regions
            colour *= 0.65 + patches * 1.2;

            // Noise-driven transparency
            float alpha = patches * (0.25 + uExplosion * 0.175);

            // Retain a subtle corona even when not exploding
            alpha = max(alpha, 0.08);

            gl_FragColor = vec4(colour, alpha);
        }
    `
};
