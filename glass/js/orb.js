export default class Orb {
    constructor(three, x, col) {
        this.grp = new three.Group();
        this.grp.position.x = x;
        const shell = new three.Mesh(
            new three.SphereGeometry(1, 96, 96),
            new three.MeshPhysicalMaterial({
                color: col,
                transmission: 0.1,
                thickness: 0.8,
                ior: 1.95,
                roughness: 0.3,
                metalness: 0.3,
                transparent: true,
                opacity: 0.51
            })
        );
        const core = new three.Mesh(
            new three.SphereGeometry(0.32, 48, 48),
            new three.MeshStandardMaterial({
                emissive: col, 
                emissiveIntensity: 4, 
                color: 0x111111}
            )
        );
        const glow = new three.PointLight(col, 18, 8);
        this.grp.add(shell, core, glow);
    }
    update(elapsed, i) {
        this.grp.position.y = Math.sin(elapsed + i) * 0.25;
        this.grp.rotation.y += 0.003;
    }
    addToScene(scene) {
        scene.add(this.grp);
    }
}
