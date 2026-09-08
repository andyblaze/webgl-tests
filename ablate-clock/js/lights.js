export default class Lights {
    constructor(three) {
        this.lights = [];
        this.times = [0, 1, 2, 3]
        this.speeds = [0.05, 0.03, 0.07, 0.11];
        this.colors = [
            new three.Color(0xff0000), // red
            new three.Color(0xff00ff), // magenta
            new three.Color(0x0000ff), // blue
            new three.Color(0x00ffff), // cyan
            new three.Color(0x00ff00), // green
            new three.Color(0xffff00), // yellow
        ];
    }
    create(three, scene) {
        const amb = new three.HemisphereLight(0xffffff, 0x333333, 2);
        scene.add(amb);

        const dir0 = new three.DirectionalLight(0xff0000, 5);
        dir0.position.set(5, -5, 5);
        scene.add(dir0);

        const dir1 = new three.DirectionalLight(0xffff00, 5);
        dir1.position.set(5, 5, 5);
        scene.add(dir1);

        const dir2 = new three.DirectionalLight(0x0000ff, 5);
        dir2.position.set(-5, -5, 5);
        scene.add(dir2);

        const dir3 = new three.DirectionalLight(0x00ff00, 5);
        dir3.position.set(-5, 5, 5);
        scene.add(dir3);

        //dir1.castShadow = true;
        dir2.castShadow = true;

        this.lights = [dir0, dir1, dir2, dir3];
    }
    update(dt) {
        this.times[0] += dt * this.speeds[0];
        this.times[1] += dt * this.speeds[1];

        for (let i = 0; i < this.lights.length; i++) {
            const light = this.lights[i];

            const position = (this.times[i] + i * 0.5) % 1;

            const scaled = position * this.colors.length;
            const index = Math.floor(scaled);
            const t = scaled - index;

            const colour1 = this.colors[index];
            const colour2 = this.colors[(index + 1) % this.colors.length];

            light.color.copy(colour1).lerp(colour2, t);
        }
    }
}
