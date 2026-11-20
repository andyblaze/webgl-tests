
export const trailShader = {
    vertex: `
        uniform float uTime;

        attribute float aTrailProgress;

        varying float vFade;
        varying float vPulse;

        void main() {
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

            vFade = pow(1.0 - aTrailProgress, 1.7);

            vPulse = 0.85 + 0.15 * sin(
                uTime * 8.0 - aTrailProgress * 12.0
            );

            float size = mix(11.0, 2.0, aTrailProgress);

            gl_PointSize = size * (180.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
        }
    `,

    fragment: `
        varying float vFade;
        varying float vPulse;

        void main() {
            vec2 uv = gl_PointCoord - 0.5;
            float d = length(uv) * 2.0;

            if (d > 1.0) discard;

            float glow = exp(-d * 5.0);
            float hotCore = exp(-d * 15.0);

            vec3 orange = vec3(1.0, 0.22, 0.015);
            vec3 red = vec3(0.8, 0.035, 0.005);
            vec3 colour = mix(red, orange, 1.0 - vFade);

            colour += vec3(1.0, 0.35, 0.04) * hotCore * 0.45;

            float alpha = glow * vFade * vPulse * 0.8;

            gl_FragColor = vec4(colour, alpha);
        }
    `
};
