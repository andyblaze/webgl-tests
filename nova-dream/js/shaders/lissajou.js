
export const shader = {
    vertex: `
        uniform float uTime;
        uniform float uEnergy;

        attribute float motionPosition;
        attribute float motionPhase;
        attribute float motionSpeed;
        attribute float motionSpread;

        attribute float stdSize;
        attribute vec3 stdColor;
        attribute float stdBrightness;

        varying vec3 vColor;
        varying float vBrightness;
        varying float vAlpha;

        void main() {
            float time = uTime;

            // Position along the shared Lissajous curve
            float t = motionPosition * 6.28318530718;

            // Individual particle travel
            t += time * motionSpeed + motionPhase;

            // Lissajous frequencies
            float x = sin(t * 3.0);
            float y = sin(t * 2.0);
            float z = sin(t * 5.0);

            // Build the underlying curve
            vec3 particlePosition = vec3(x, y, z);

            // Scale the structure
            particlePosition *= 3.0;

            // Individual displacement around the curve
            float spread = motionSpread * (1.0 + uEnergy * 0.5);

            particlePosition.x += sin(motionPhase * 2.3 + time * 0.4) * spread;
            particlePosition.y += cos(motionPhase * 3.1 + time * 0.5) * spread;
            particlePosition.z += sin(motionPhase * 1.7 + time * 0.3) * spread;

            // Gentle individual breathing
            float breathing = sin(time * 1.1 + motionPhase) * 0.08;

            particlePosition *= 1.0 + breathing;

            // Energy gently expands the entire system
            particlePosition *= 1.0 + uEnergy * 0.025;

            vec4 mvPosition = modelViewMatrix * vec4(particlePosition, 1.0);

            gl_Position = projectionMatrix * mvPosition;

            // Larger, more visible particles
            gl_PointSize = clamp(
                stdSize * (85.0 / -mvPosition.z),
                1.5,
                12.0
            );

            vColor = stdColor;
            vBrightness = stdBrightness;

            // Individual twinkling
            vAlpha = 0.72 + 0.28 * sin(time * 1.5 + motionPhase);
        }
    `,

    fragment: `
        varying vec3 vColor;
        varying float vBrightness;
        varying float vAlpha;

        void main() {
            vec2 uv = gl_PointCoord - 0.5;
            float d = length(uv) * 2.0;

            if (d > 1.0) discard;

            // Broad coloured atmosphere
            float atmosphere = exp(-d * 4.5);

            // Defined luminous body
            float body = smoothstep(1.0, 0.12, d);

            // Bright central nucleus
            float nucleus = exp(-d * 18.0);

            // Soft outer falloff
            float halo = exp(-d * 2.8);

            vec3 color =
                vColor * (
                    atmosphere * 0.7 +
                    body * 0.65 +
                    nucleus * 1.8
                );

            // Slightly warm-white luminous centre
            color += vec3(0.65, 0.8, 1.0) * nucleus * 0.45;

            float alpha =
                (atmosphere * 0.32 +
                body * 0.55 +
                nucleus * 0.8) * vAlpha;

            color *= vBrightness;

            gl_FragColor = vec4(color, alpha);
        }
    `
};
