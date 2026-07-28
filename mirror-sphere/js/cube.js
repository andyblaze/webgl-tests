import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";

export default class Cube {
    constructor(three, cfg, renderTarget, scene) {
        this.visible = true;
        const loader = new three.TextureLoader();
        const canvasTexture = loader.load("bump-sph.png");
        const normalTexture = loader.load("norm-sph.png");

        this.cube = new three.Mesh(
            new three.SphereGeometry(cfg.cubeSize, 96, 96),//cfg.cubeSize, cfg.cubeSize, 6, 0.08),
            new three.MeshPhysicalMaterial({
                color: 0xaaaaaa,
                transparent: false,
                //opacity: 1,

                metalness: 0.95,
                roughness: 0.1,
                emissiveIntensity: 0.1251,
                emissive: 0x00ffff,

                clearcoat: 1,
                clearcoatRoughness: 0.125,

                bumpMap: canvasTexture,
                bumpScale: 20,

                envMap: renderTarget.texture,
                envMapIntensity: 8,

                reflectivity: 1,
                ior: 1.5,

                normalMap: normalTexture,
                normalScale: new three.Vector2(0.125, 0.125)

            })
        );
        this.cube.position.copy(cfg.cubeCentre);
        scene.add(this.cube);
        /*const shellSize = cfg.cubeSize * 1.0125;

        const geometry = new RoundedBoxGeometry(shellSize, shellSize, shellSize, 6, 0.08);

        this.shell = new three.Mesh(
            geometry,
            new three.MeshBasicMaterial({
                color:0xffffff,
                transparent:true,
                opacity:0.05,
                //ior: 1.5
            })
        );

        this.shell.position.copy(this.cube.position);
        scene.add(this.shell);*/
    }
    update(elapsed) {
        this.cube.rotation.x = elapsed * 0.17;
        this.cube.rotation.y = elapsed * 0.11;
        this.cube.rotation.z = elapsed * 0.08;
        /*this.shell.rotation.x = elapsed * 0.17;
        this.shell.rotation.y = elapsed * 0.11;
        this.shell.rotation.z = elapsed * 0.08;*/
    }
    getPosition() {
        return this.cube.position;
    }
    toggleVisibilty() {
        this.cube.visible = !this.cube.visible;
    }
}