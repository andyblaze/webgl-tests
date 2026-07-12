import { mt_randf } from "./functions.js";

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

        this.color = new three.Color();
        this.color.setRGB(0.25, 0.25, 0.25);

        const shape = new three.Shape();
        const scale = mt_randf(2.4, 2.8);

        shape.moveTo(0, 0);
        shape.lineTo(-6 * scale, -3 * scale);
        shape.lineTo(-3 * scale, 0);
        shape.lineTo(-6 * scale, 3 * scale);
        shape.closePath();

        //const geometry = ;

        this.boidMesh = new three.InstancedMesh(
            new three.ShapeGeometry(shape),
            new three.MeshBasicMaterial({
                color: 0xffffff,
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
            const angle = Math.atan2(boid.velocity.y, boid.velocity.x);

            this.dummy.position.set(boid.position.x, boid.position.y, 0);

            this.dummy.rotation.z = angle;
            this.dummy.updateMatrix();
            this.boidMesh.setMatrixAt(i, this.dummy.matrix);
            this.color.setRGB(boid.opacity, boid.opacity, boid.opacity);   // 0 = black, 1 = white
            //console.log(this.color);
            this.boidMesh.setColorAt(i, this.color); 
            /*this.dummy.position.set(boid.position.x, boid.position.y, 0);
            this.dummy.updateMatrix();
            this.boidMesh.setMatrixAt(i, this.dummy.matrix);*/
        }); 

        this.boidMesh.instanceMatrix.needsUpdate = true;
        this.boidMesh.instanceColor.needsUpdate = true;

        this.renderer.render(this.scene, this.camera);
    }
}