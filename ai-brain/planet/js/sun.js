export default class Sun {
    constructor(three) {

        this.three = three;
        this.group = new three.Group();

        this.time = 0;

        const geometry = new three.SphereGeometry(
            100,    // size of visible sun
            64,
            32
        );

        this.material = new three.MeshBasicMaterial({
            color: 0xffcc66
        });

        this.mesh = new three.Mesh(
            geometry,
            this.material
        );

        this.group.add(this.mesh);

        //
        // Position in the sky
        //
        this.group.position.set(
            -900,
            400,
            -2100
        );
    }

    update(dt) {
        this.time += dt;

        //
        // very crude "boiling" motion for now
        //
        const pulse = Math.sin(this.time * 2) * 0.02 + 1;

        //this.mesh.scale.set(pulse, pulse, pulse);
    }

    addToScene(scene) {
        scene.add(this.group);
    }

    get position() {
        return this.group.position;
    }
}
