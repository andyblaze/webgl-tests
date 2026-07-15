import { hash, noise } from "./functions.js";

class Color {
    constructor() {
        this.c = {r: 0, g: 0, b: 0, a: 255 };
    }
    setRgba(r, g, b, a=255) {
        this.c.r = r;
        this.c.g = g;
        this.c.b = b;
        this.c.a = a;
    }
    scalarAdd(r, g, b) {
        this.c.r += r;
        this.c.g += g;
        this.c.b += b;
    }
    multiplyBy(r, g, b) {
        this.c.r *= r;
        this.c.g *= g;
        this.c.b *= b;
    }
}

export default class Planet {
    constructor(three) {
        this.group = new three.Group();
        this.radius = 1000;

        const texture = this.createIceTexture(three);

        const surface = new three.Mesh(
            new three.SphereGeometry(this.radius, 128, 64),
            new three.MeshLambertMaterial({
                map: texture
            })
        );

        this.group.add(surface);

        // Camera starts above the north pole
        this.group.position.y = -this.radius;
    }


    createIceTexture(three) {

        const width = 2048;
        const height = 1024;

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        const image = ctx.createImageData(width, height);


        for (let y = 0; y < height; y++) {

            const latitude = Math.abs((y / height) - 0.5) * 2;

            for (let x = 0; x < width; x++) {

                const nx = x / width;
                const ny = y / height;


                // Big ice plates
                const large = this.fractalNoise(
                    nx * 45,
                    ny * 95
                );


                // Medium broken ice structure
                const medium = this.fractalNoise(
                    nx * 142,
                    ny * 92
                );


                // Fine surface variation
                const fine = noise(
                    nx * 8,
                    ny * 8
                );


                // Long ice fractures
                const cracks = noise(
                    nx * 10.5,
                    ny * 10.8
                );


                // Combine scales
                const ice =
                    large * 0.55 +
                    medium * 0.30 +
                    fine * 0.15;


                const color = new Color();
                let r, g, b;


                // Deep frozen ocean
                if (ice < 0.28) {
                    color.setRgba(20, 45, 90);

                    r = 20;
                    g = 45;
                    b = 90;

                }

                // Dark blue ice fields
                else if (ice < 0.45) {
                    color.setRgba(
                        50 + medium * 50,
                        110 + medium * 60,
                        170 + medium * 60
                    );

                    r = 50 + medium * 50;
                    g = 110 + medium * 60;
                    b = 170 + medium * 60;

                }

                // Blue-white fractured ice
                else if (ice < 0.65) {

                    color.setRgba(
                        130 + fine * 60,
                        180 + fine * 50,
                        220 + fine * 35
                    );

                    r = 130 + fine * 60;
                    g = 180 + fine * 50;
                    b = 220 + fine * 35;

                }

                // Bright ice ridges
                else {
                    color.setRgba(
                        210 + fine * 30,
                        225 + fine * 25,
                        245 + fine * 10

                    );
                    r = 210 + fine * 30;
                    g = 225 + fine * 25;
                    b = 245 + fine * 10;

                }


                // Polar tint, but subtle
                const polar = latitude * 20;
                color.scalarAdd(polar);

                r += polar;
                g += polar;
                b += polar;


                // Dark winding cracks
                if (cracks < 0.16) {
                    color.multiplyBy(0.55, 0.65, 0.8);
                    r *= 0.55;
                    g *= 0.65;
                    b *= 0.80;

                }


                // Random icy sparkle
                if (fine > 0.085) {
                    color.scalarAdd(20);

                    r += 20;
                    g += 20;
                    b += 20;

                }


                const index = (y * width + x) * 4;

                image.data[index] = Math.min(255, r);
                image.data[index + 1] = Math.min(255, g);
                image.data[index + 2] = Math.min(255, b);
                image.data[index + 3] = 255;
            }
        }


        ctx.putImageData(image, 0, 0);


        const texture = new three.CanvasTexture(canvas);
        texture.wrapS = three.RepeatWrapping;
        texture.wrapT = three.ClampToEdgeWrapping;

        return texture;
    }


    fractalNoise(x, y) {

        let value = 0;
        let amplitude = 1;
        let frequency = 1;
        let total = 0;


        for (let i = 0; i < 5; i++) {

            value += noise(
                x * frequency,
                y * frequency
            ) * amplitude;

            total += amplitude;

            amplitude *= 0.5;
            frequency *= 2;
        }


        return value / total;
    }





    

    addToScene(scene) {
        scene.add(this.group);
    }


    update(camera) {
        this.group.rotation.x += 0.0001;
    }
}