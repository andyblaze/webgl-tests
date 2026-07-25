import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";

export default class Cube {
    constructor(three, cfg, renderTarget, scene) {
        this.visible = true;
        const loader = new three.TextureLoader();
        const canvasTexture = loader.load("canvas.png");
        const normalTexture = loader.load("normal.png");

        this.cube = new three.Mesh(
            new RoundedBoxGeometry(cfg.cubeSize, cfg.cubeSize, cfg.cubeSize, 6, 0.08),
            new three.MeshPhysicalMaterial({
                color: 0x444444,
                transparent: true,
                opacity: 1,

                metalness: 1,
                roughness: 0.08,

                clearcoat: 1,
                clearcoatRoughness: 0.05,

                envMap: renderTarget.texture,
                envMapIntensity: 8,

                reflectivity: 1,
                ior: 1.5,

                normalMap: normalTexture,
                normalScale: new three.Vector2(0.15, 0.15)

            })
        );
        this.cube.position.copy(cfg.cubeCentre);
        scene.add(this.cube);
        const shellSize = cfg.cubeSize * 1.0125;

        const geometry = new RoundedBoxGeometry(shellSize, shellSize, shellSize, 6, 0.08);

        this.shell = new three.Mesh(
            geometry,
            new three.MeshBasicMaterial({
                color:0xffffff,
                transparent:true,
                opacity:0.05,
                ior: 1.5
            })
        );

        this.shell.position.copy(this.cube.position);
        scene.add(this.shell);
    }
    update(elapsed) {
        this.cube.rotation.x = elapsed * 0.07;
        this.cube.rotation.y = elapsed * 0.09;
        this.cube.rotation.z = elapsed * 0.08;
        this.shell.rotation.x = elapsed * 0.07;
        this.shell.rotation.y = elapsed * 0.09;
        this.shell.rotation.z = elapsed * 0.08;
    }
    getPosition() {
        return this.cube.position;
    }
    toggleVisibilty() {
        this.cube.visible = !this.cube.visible;
    }
}