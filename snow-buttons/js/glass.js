export default class Glass {
  static create(three, globe) {
    const radius = globe.height / 2;
    const length = globe.width - globe.height;

    const geometry = new three.CapsuleGeometry(
      radius,
      length,
      16,
      32
    );

    const loader = new three.TextureLoader();
    Glass.texNorm = loader.load("./textures/cloud-normal.png" );
    Glass.texRough = loader.load("./textures/stone.png" );
    Glass.texNorm.colorSpace = three.NoColorSpace;
    Glass.texRough.colorSpace = three.NoColorSpace;
    Glass.texNorm.wrapS = three.RepeatWrapping;
Glass.texNorm.wrapT = three.RepeatWrapping;




Glass.texRough.wrapS = three.RepeatWrapping;
Glass.texRough.wrapT = three.RepeatWrapping;

Glass.texNorm.offset.set(
  Math.random() * 2,
  Math.random() * 2
);

Glass.texRough.offset.set(
  Math.random() * 2,
  Math.random() * 2
);

    const material = new three.MeshPhysicalMaterial({
      color: globe.config.color,
      transmission: 0.75,
      roughness: 0.62,
      metalness: 0.52,
      normalMap: Glass.texNorm,
      normalScale: new three.Vector2(2, 2),
      roughnessMap: Glass.texRough,

      transparent: true,
      opacity:0.925,

      clearcoat: 1,
      clearcoatRoughness:0.95,

      emissive: globe.config.color,
      emissiveIntensity: 0.9648,

      ior: 1.45,

      thickness: 2.5
      
    });

    return new three.Mesh(
      geometry,
      material
    );
  }
  static update(dt, elapsed) {
    Glass.texNorm.offset.x = elapsed * 0.01;
    Glass.texNorm.offset.y = elapsed * 0.007;
    Glass.texNorm.offset.z = elapsed * 0.013;

    Glass.texRough.offset.x = elapsed * -0.007;
    Glass.texRough.offset.y = elapsed * 0.011;
    Glass.texRough.offset.z = elapsed * 0.017;
  }
}
/*
export default class Glass {
    static create(three, button) {


      const material = new three.ShaderMaterial({
        transparent: true,
        depthWrite: false,

        uniforms: {
          color: {
            value: new three.Color(
              button.config.color
            )
          },

          hover: {
            value: 0
          }
        },

        vertexShader: `
          varying vec2 vUv;

          void main() {
            vUv = uv;

            gl_Position =
              projectionMatrix *
              modelViewMatrix *
              vec4(position, 1.0);
          }
        `,

        fragmentShader: `
          uniform vec3 color;
          uniform float hover;

          varying vec2 vUv;

          void main() {
            float edge =
              smoothstep(
                0.0,
                0.18,
                vUv.y
              ) *
              smoothstep(
                1.0,
                0.82,
                vUv.y
              );

            float highlight =
              smoothstep(
                0.65,
                0.05,
                vUv.y
              );

            vec3 tint =
              mix(
                color,
                vec3(1.0),
                highlight * 0.18
              );

            float alpha =
              0.075 +
              highlight * 0.045 +
              hover * 0.035;

            gl_FragColor =
              vec4(
                tint,
                alpha
              );
          }
        `
      });

      const shape = new three.Shape();

      const w = button.width - 2;
      const h = button.height - 2;
      const halfW = w / 2;
      const halfH = h / 2;
      const r = halfH;

      shape.moveTo(-halfW + r, -halfH);
      shape.lineTo(halfW - r, -halfH);
      shape.absarc(
        halfW - r,
        0,
        r,
        -Math.PI / 2,
        Math.PI / 2,
        false
      );
      shape.lineTo(-halfW + r, halfH);
      shape.absarc(
        -halfW + r,
        0,
        r,
        Math.PI / 2,
        -Math.PI / 2,
        false
      );

      const geometry =
        new three.ShapeGeometry(shape);

      return new three.Mesh(
        geometry,
        material
      );
    }
  }*/
