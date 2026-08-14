export default class Rim {
    static create(three, button) {
      /*
       * This is an ellipse rather than a mathematically perfect
       * capsule rim, but it gives the glass a pleasantly soft edge.
       * 
       */

        /*
       * A thin bright rim.
       */
      const lineGeometry =
        new three.BufferGeometry();

      const points = [];

      const segments = 64;

      for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const angle = t * Math.PI * 2;

        const x = Math.cos(angle) * (button.width * 0.5 - 1);
        const y = Math.sin(angle) * (button.height * 0.5 - 1);

        points.push(new three.Vector3(x, y, 4));
      }

      lineGeometry.setFromPoints(points);

      return new three.Line(
        lineGeometry,
        new three.LineBasicMaterial({
          color: button.config.particle,
          transparent: true,
          opacity: 0.14
        })
      );
    }
  }