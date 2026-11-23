export const markerShader = {
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
        uniform float uTime;
        uniform vec3 uMarkerColor;

        varying vec3 vNormal;
        varying vec3 vPosition;

        void main() {
            vec3 normal = normalize(vNormal);

            // Warm orange body, with a darker edge
            float rim = pow(1.0 - abs(normal.z), 2.0);

            // Slow energy fluctuations
            float pulse = 0.5 + 0.5 * sin(
                uTime * 7.0 +
                vPosition.x * 18.0 +
                vPosition.y * 13.0
            );

            vec3 deepColor = uMarkerColor * 0.45;
            vec3 hotColor  = uMarkerColor;
            vec3 brightColor = mix(uMarkerColor, vec3(1.0), 0.45);

            vec3 colour = mix(
                deepColor,
                hotColor,
                pulse * 0.65
            );

            colour = mix(
                colour,
                brightColor,
                pow(rim, 1.5) * 0.45
            );

            gl_FragColor = vec4(colour, 1.0);
        }
    `
};