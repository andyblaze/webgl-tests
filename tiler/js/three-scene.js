import { byId } from "./functions.js";

class ThreeScene {
    constructor(three, id) {
        this.wrap = byId(id);
        this.scene = new three.Scene();
        this.scene.background = new three.Color(0x222222);

        this.camera = new three.PerspectiveCamera(
            45,
            this.wrap.clientWidth / this.wrap.clientHeight,
            0.1,
            100
        );
        this.camera.position.z = 3;

        this.renderer = new three.WebGLRenderer({ antialias: true });
        this.renderer.setSize(this.wrap.clientWidth, this.wrap.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);

        this.wrap.appendChild(this.renderer.domElement);

        const lightR = new three.DirectionalLight(0xff0000, 2);
        lightR.position.set(8, 5, 0);
        this.scene.add(lightR);

        const lightG = new three.DirectionalLight(0x00ff00, 2);
        lightG.position.set(-8, 5, 0);
        this.scene.add(lightG);

        const lightB = new three.DirectionalLight(0x0000ff, 2);
        lightB.position.set(0, -8, 0);
        this.scene.add(lightB);

        this.geometry = new three.SphereGeometry(1, 64, 64);

        this.material = new three.MeshStandardMaterial({
            color: 0xffffff,
            roughness: 0.6,
            metalness: 0.8,
            clearcoat: 1,
            clearcoatRoughness: 0.4,
            anisotropy: 1
        });

        this.sphere = new three.Mesh(this.geometry, this.material);
        this.scene.add(this.sphere);
    }
    rotateShape() {
        this.sphere.rotation.y += 0.002;
        this.sphere.rotation.x += 0.001;
        this.sphere.rotation.z += 0.003;
    }
    setTexture(three, cnvs) {
        const tex = new three.CanvasTexture(cnvs);
        tex.wrapS = three.RepeatWrapping;
        tex.wrapT = three.RepeatWrapping;

        tex.repeat.set(4, 4);
        this.material.map = tex;
        this.material.needsUpdate = true;        
    }
    render() {
        this.renderer.render(this.scene, this.camera);
    }
}
