export const shader = {
    vertex: `
        uniform float uTime;
        uniform float uEnergy;

        attribute float mRadius;
        attribute float mAngle;
        attribute float mInclination;
        attribute float mSpeed;
        attribute float aSize;
        attribute float mPhase;
        attribute vec3 aColor;
        attribute float aBrightness;

        varying vec3 vColor;
        varying float vBrightness;
        varying float vAlpha;

        void main() {
            float time = uTime;

            // Orbital travel
            float angle =
                mAngle + time * mSpeed;

            // Gentle individual breathing
            float breathing =
                sin(time * 1.1 + mPhase) * 0.12;

            float radius =
                mRadius + breathing * (0.5 + uEnergy);

            // Slightly elliptical orbital paths
            float x = cos(angle) * radius;
            float z = sin(angle) * radius * 0.78;

            // Individual vertical motion
            float wave =
                sin(angle * 2.0 + mPhase) * 0.16;

            float y =
                wave +
                sin(time * 0.65 + mPhase) * 0.12;

            // Rotate each stream into its own plane
            float inc = mInclination;

            float tiltedY =
                y * cos(inc) - z * sin(inc);

            float tiltedZ =
                y * sin(inc) + z * cos(inc);

            vec3 particlePosition = vec3(
                x,
                tiltedY,
                tiltedZ
            );

            // Energy gently expands the entire system
            particlePosition *=
                1.0 + uEnergy * 0.025;

            vec4 mvPosition =
                modelViewMatrix *
                vec4(particlePosition, 1.0);

            gl_Position =
                projectionMatrix * mvPosition;

            // Larger, more visible particles
            gl_PointSize = clamp(
                aSize * (85.0 / -mvPosition.z),
                1.5,
                12.0
            );

            vColor = aColor;
            vBrightness = aBrightness;

            // Individual twinkling
            vAlpha = 0.72 +
                0.28 * sin(time * 1.5 + mPhase);
        }`
    ,
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
        }`
}
