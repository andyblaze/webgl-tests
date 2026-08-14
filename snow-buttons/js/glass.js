export default class Glass {
    static create(three, button) {
      /*
       * A very subtle highlight layer.
       * This is intentionally not physically accurate glass.
       * The goal is a soft "thick coloured capsule" impression.
       */

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
  }
  