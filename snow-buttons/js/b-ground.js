export default class Background {
    static create(three, button) {
      const material = new three.MeshBasicMaterial({
        color: button.config.color,
        transparent: true,
        opacity: 0.22
      });

      /*
        * Slightly smaller than the actual button so the outer HTML
        * border/highlight remains visible.
        */
      const shape = new three.Shape();

      const w = button.width - 2;
      const h = button.height - 2;
      const halfW = w / 2;
      const halfH = h / 2;
      const r = halfH;

      shape.moveTo(-halfW + r, -halfH);
      shape.lineTo(halfW - r, -halfH);
      shape.quadraticCurveTo(halfW, -halfH, halfW, 0);
      shape.quadraticCurveTo(halfW, halfH, halfW - r, halfH);
      shape.lineTo(-halfW + r, halfH);
      shape.quadraticCurveTo( -halfW, halfH, -halfW, 0);
      shape.quadraticCurveTo( -halfW, -halfH, -halfW + r, -halfH);

      const geometry = new three.ShapeGeometry(shape);

      return new three.Mesh(geometry, material);
  }
}
