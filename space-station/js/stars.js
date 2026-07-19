export default class StarsDecor {
    constructor(three, numStars) {
        this.STAR_COUNT = numStars;
        this.positions = [];
        this.colours = [];
        this.radius = 1450;

        for ( let i =0 ; i < this.STAR_COUNT; i++ ) {

            const u = Math.random();
            const v = Math.random();

            const theta = 2 * Math.PI * u;
            const phi = Math.acos(2 * v - 1);

            const x = this.radius * Math.sin(phi) * Math.cos(theta);
            const y = this.radius * Math.cos(phi);
            const z = this.radius * Math.sin(phi) * Math.sin(theta);
            this.positions.push(x, y, z);

            const b = 0.65 + Math.random() * 0.35;
            this.colours.push(b, b, b);

        }

        const geometry = new three.BufferGeometry();
        geometry.setAttribute("position", new three.Float32BufferAttribute(this.positions, 3));
        geometry.setAttribute("color", new three.Float32BufferAttribute(this.colours, 3));

        const material = new three.PointsMaterial({
            size:2,
            sizeAttenuation:false,
            vertexColors:true
        });

        this.stars = new three.Points(geometry, material);
    }
    get actual() {
        return this.stars;
    }
    copyPosition(p) {
        this.stars.position.copy(p);
    }  
    update() {

    }  
    addToScene(scene) {
        scene.add(this.stars);
    }
}
