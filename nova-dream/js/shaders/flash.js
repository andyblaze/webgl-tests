
export const flashShader = {
    vertex: `
        varying vec3 vNormal;

        void main() {
            vNormal = normalize(normalMatrix * normal);

            gl_Position = projectionMatrix *
                          modelViewMatrix *
                          vec4(position, 1.0);
        }
    `,

    fragment: `
        uniform vec3 uColor;

        varying vec3 vNormal;

        void main() {
            vec3 normal = normalize(vNormal);
            vec3 lightDirection = normalize(vec3(-0.4, 0.6, 1.0));

            float diffuse = max(dot(normal, lightDirection), 0.0);
            float rim = pow(1.0 - max(dot(normal, vec3(0.0, 0.0, 1.0)), 0.0), 2.0);

            vec3 colour = uColor * (0.4 + diffuse * 0.8);
            colour += uColor * rim * 0.5;

            gl_FragColor = vec4(colour, 1.0);
        }
    `
};
