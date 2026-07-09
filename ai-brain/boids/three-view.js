

export default class View {
    constructor(three, id, config) {
        this.cfg = config;
        this.canvas = document.getElementById(id);
        this.renderer = new three.WebGLRenderer({
            canvas: this.canvas,
            antialias: true
        });
        this.renderer.setClearColor(0x87ceeb);   // sky blue
        this.scene = new three.Scene();
        this.camera = new three.OrthographicCamera(0, config.width, config.height, 0, -10, 10);
        this.camera.position.z = 1;

        this.boidMesh = new three.InstancedMesh(
            new three.CircleGeometry(4, 24),
            new three.MeshBasicMaterial({
                color: 0x000000,
                side: three.DoubleSide,
                transparent: true
            }),
            config.numBoids
        );
        this.scene.add(this.boidMesh);

        this.dummy = new three.Object3D();
    }
    resize(w, h) {
        this.renderer.setSize(w, h);
        this.camera.left   = 0;
        this.camera.right  = w;
        this.camera.top    = 0;
        this.camera.bottom = h;
        this.camera.near = -1;
        this.camera.far  = 1;
        this.camera.position.z = 1;
        this.camera.updateProjectionMatrix();
    }
    draw(boids) {
        boids.forEach((boid, i) => {
            this.dummy.position.set(boid.position.x, boid.position.y, 0);
            this.dummy.updateMatrix();
            this.boidMesh.setMatrixAt(i, this.dummy.matrix);

        }); 

        this.boidMesh.instanceMatrix.needsUpdate = true;

        this.renderer.render(this.scene, this.camera);
    }
}