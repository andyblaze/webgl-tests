export default class Voronoi {
    constructor(three, cfg) {
        this.geometry = new three.PlaneGeometry(cfg.innerW, cfg.innerH);
        this.material = new three.ShaderMaterial({
            transparent: true,
            uniforms: {
                uTime: { value: 0 },
                uResolution: {
                    value: new three.Vector2(cfg.innerW, cfg.innerH)
                }
            },
            vertexShader: `
                varying vec2 vUv;

                void main() {
                    vUv = uv;

                    gl_Position = projectionMatrix *
                                modelViewMatrix *
                                vec4(position, 1.0);
            }`,
            fragmentShader: `
                uniform float uTime;
                uniform vec2 uResolution;
                varying vec2 vUv;

                void main() {                 
                    vec2 uv = gl_FragCoord.xy / uResolution;

                    // Voronoi cell coordinates
                    vec2 grid = uv * 12.0;
                    vec2 cell = floor(grid);
                    vec2 local = fract(grid);

                    float minDist = 10.0;

                    // Look at neighbouring cells
                    for (int y = -1; y <= 1; y++) {
                        for (int x = -1; x <= 1; x++) {

                            vec2 neighbour = vec2(float(x), float(y));
                            vec2 seed = cell + neighbour;
                            
                            vec2 point = vec2(
                                fract(sin(dot(seed, vec2(127.1, 311.7))) * 43758.5453),
                                fract(sin(dot(seed, vec2(269.5, 183.3))) * 43758.5453)
                            );

                            // Make the point orbit around its original position
                            point += vec2(
                                sin(uTime * 2.0 + point.y * 20.0),
                                cos(uTime * 1.7 + point.x * 20.0)
                            ) * 0.25;

                            vec2 diff = neighbour + point - local;
                            float dist = length(diff);

                            minDist = min(minDist, dist);
                        }
                    }

                    // Cell interior
                    float light = 1.0 - smoothstep(0.0, 0.7, minDist);
                    float edge = smoothstep(0.08, 0.0, minDist);
                        // Fade as the plane moves away from camera
                    float farFade = 1.0 - smoothstep(1.0, 0.65, vUv.y);

                    gl_FragColor = vec4(
                        0.2,
                        1.0,
                        1.0,
                        edge * 0.5
                    );

                    float alpha = light * 0.15 * farFade;

                    gl_FragColor = vec4(
                        0.2,
                        1.0,
                        1.0,
                        alpha
                    );
                }`
        });
        this.threeObj = new three.Mesh(this.geometry, this.material);
        this.threeObj.position.set(cfg.halfW, cfg.innerH / 3, 1500);
        this.threeObj.rotation.x = Math.PI * 0.15;
    }
    get native() {
        return this.threeObj;
    }
    update(dt, elapsed) {
        this.material.uniforms.uTime.value = elapsed;
    }
}
