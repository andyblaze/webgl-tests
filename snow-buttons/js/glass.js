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
