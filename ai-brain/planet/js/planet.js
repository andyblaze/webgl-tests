export default class Planet {
    constructor(three) {
        this.group = new three.Group();
        this.radius = 1000;
        const texture = new three.TextureLoader().load("oce.jpg");

        texture.wrapS = three.RepeatWrapping;
        texture.wrapT = three.RepeatWrapping;
        texture.repeat.set(14, 12);

        const surface = new three.Mesh(
            new three.SphereGeometry(this.radius, 128, 64),
            new three.MeshLambertMaterial({
                map: texture
            })
        );
        this.group.add(surface);

        // Camera starts above the north pole, so move the
        // whole planet down by its radius.
        this.group.position.y = -this.radius;
    }

    addToScene(scene) {
        scene.add(this.group);
    }

    update(camera) {
const metresTravelled = camera.position.x;

const angle = metresTravelled / this.radius;

this.group.rotation.x += 0.0001;

    }
}
