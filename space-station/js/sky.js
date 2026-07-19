export default class SkyDome {
    constructor(three, decor) {
        this.group = new three.Group();
        this.stars = decor.actual;
        this.group.add(this.stars);

        const geometry = new three.SphereGeometry(2500, 64, 32);
        const material = new three.ShaderMaterial({
            side: three.BackSide,
            uniforms:{
                topColor :{ value: new three.Color(0x020206) },
                bottomColor :{ value: new three.Color(0x051d90) }
            },
            vertexShader :`
                varying vec3 vPosition;
                void main() {
                    vPosition = position;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
                }`,

            fragmentShader :`
                varying vec3 vPosition;

                uniform vec3 topColor;
                uniform vec3 bottomColor;

                void main() {
                    float h = normalize(vPosition).y * 0.5 + 0.5;
                    vec3 colour = mix(bottomColor, topColor, smoothstep(0.0,1.0,h));
                    gl_FragColor = vec4(colour,1.0);
                }`

        });
        this.group.add(new three.Mesh(geometry, material));
    }
    update() {
        this.stars.rotation.z += 0.0001;     
    }
    copyPosition(p) {
        this.group.position.copy(p);
    }
    addToScene(scene) {
        scene.add(this.group);
    }
}
