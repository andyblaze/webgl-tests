import { hash, fractalNoise, noise, clamp } from "./functions.js";

class Color {
    constructor() {
        this.c = { r: 0, g: 0, b: 0, a: 255 };
    }
    reset() {
        this.c = { r: 0, g: 0, b: 0, a: 255 };
    }
    setRgba(r, g, b, a=255) {
        this.c.r = r;
        this.c.g = g;
        this.c.b = b;
        this.c.a = a;
    }
    scalarAdd(n) {
        this.c.r += n;
        this.c.g += n;
        this.c.b += n;
    }
    multiplyBy(r, g, b) {
        this.c.r *= r;
        this.c.g *= g;
        this.c.b *= b;
    }
    get red() {
        return Math.min(255, this.c.r);
    }
    get green() {
        return Math.min(255, this.c.g);
    }
    get blue() {
        return Math.min(255, this.c.b);
    }
    get alpha() {
        return  Math.min(255, this.c.a);
    }
    getRgba() {
        this.c.r = Math.min(255, this.c.r);
        this.c.g = Math.min(255, this.c.g);
        this.c.b = Math.min(255, this.c.b);
        this.c.a = Math.min(255, this.c.a);
        return this.c;
    }
}

class TempCanvas {
    constructor(w, h) {
        this.canvas = document.createElement("canvas");
        this.canvas.width = w;
        this.canvas.height = h;
        this.ctx = this.canvas.getContext("2d");
        this.image = this.ctx.createImageData(w, h);        
    }
    setImgData(index, color) {
        this.image.data[index] = color.red;
        this.image.data[index + 1] = color.green;
        this.image.data[index + 2] = color.blue;
        this.image.data[index + 3] = color.alpha;
    }
    putImgData() {
        this.ctx.putImageData(this.image, 0, 0);
    }
    get actual() {
        return this.canvas;
    }
}

export default class Planet {
    constructor(three) {
        this.group = new three.Group();
        this.radius = 200;
        const canvasWidth = 2048;
        const canvasHeight = 1024;
        const maps = this.createCanvasses(canvasWidth, canvasHeight);
        const texture = this.createTexture(three, maps.tex);
        const bump = this.createTexture(three, maps.bump);
        const loader = new three.ImageLoader();
        const image = loader.load("NormalMap.png");
        const norm = this.createTexture(three, image);
        //document.body.appendChild(maps.clouds);  //will use later for saving bump & convert to normal

        const surface = new three.Mesh(
            new three.SphereGeometry(this.radius, 128, 64),
            new three.MeshStandardMaterial({
                map: texture,
                bumpMap: bump,
                //normalMap: norm,
                bumpScale: 20,
                roughness: 0.4,
                metalness: 0.5
            })
        );
        const atmos = new three.Mesh(
            new three.SphereGeometry(this.radius * 1.002, 128, 64),
            new three.MeshBasicMaterial({
                color: 0xbbccff,
                transparent: true,
                opacity: 0.15,
                side: three.BackSide,
                blending: three.AdditiveBlending
            })
        );
const lr = new three.TextureLoader();

//const cloudTexture = lr.load("hd-cloud.png");

const cloudTexture = lr.load(
    "hd-cloud.png",
    (tex) => {
        tex.wrapS = three.RepeatWrapping;
        tex.wrapT = three.ClampToEdgeWrapping;
        tex.needsUpdate = true;
    }
);

//cloudTexture.wrapS = three.RepeatWrapping;
//cloudTexture.wrapT = three.ClampToEdgeWrapping;

        const clouds = new three.Mesh(
            new three.SphereGeometry(this.radius * 1.04, 128, 64),
            new three.MeshBasicMaterial({
                map: cloudTexture,
                transparent: true,
                opacity: 0.25,
                depthWrite: false,
                side: three.BackSide,
                //blending: three.AdditiveBlending,
                roughness: 1.0,
                metalness: 0.0
            })
        );

        this.group.add(surface);
        this.group.add(atmos);
        this.group.add(clouds);

        // Camera starts above the north pole
        this.group.position.y = -this.radius;
    }
    createCanvasses(width, height) {
        const textureCanvas = new TempCanvas(width, height);
        const bumpCanvas = new TempCanvas(width, height);
        const cloudCanvas = new TempCanvas(width, height);
        const color = new Color(); // for texture only

        for (let y = 0; y < height; y++) {

            const latitude = Math.abs((y / height) - 0.5) * 2;

            for (let x = 0; x < width; x++) {
                const nx = x / width;
                const ny = y / height;

                // Big ice plates
                const large = fractalNoise(nx * 45, ny * 95);
                // Medium broken ice structure
                const medium = fractalNoise(nx * 142, ny * 92);
                // Fine surface variation
                const fine = noise(nx * 8, ny * 8);
                // Long ice fractures
                const cracks = noise(nx * 10, ny * 11);
                // Combine scales
                const ice = large * 0.55 + medium * 0.30 + fine * 0.15;
                // Polar tint, but subtle
                const polar = latitude * 20;
                const index = (y * width + x) * 4;

                // improve this code later
                let bumpHeight = large * 0.3 + medium * 0.5 + fine * 0.2;
                bumpHeight -= cracks * 0.725;
                //bumpHeight = Math.pow(bumpHeight, 3);
                bumpHeight = clamp(bumpHeight, 0, 1);
                const h = Math.floor(bumpHeight * 255);

                bumpCanvas.image.data[index] = h;
                bumpCanvas.image.data[index + 1] = h;
                bumpCanvas.image.data[index + 2] = h;
                bumpCanvas.image.data[index + 3] = 255;
                //bumpCanvas.setImgData(index, clamp(bumpHeight, 0, 255)); 

//-------------------------------------------------------
            // CLOUDS
            //-------------------------------------------------------

            // Low-frequency distortion field
            const warp = fractalNoise(
                nx * 3,
                ny * 3
            );

            const wx = nx + (warp - 0.5) * 0.08;
            const wy = ny + (warp - 0.5) * 0.08;

            // Stretched cloud field
            let cloud =
                fractalNoise(
                    wx * 8,
                    wy * 2
                );

            // Break up long streaks
            cloud =
                cloud * 0.75 +
                fractalNoise(
                    wx * 20,
                    wy * 8
                ) * 0.25;

            // Slight equatorial preference
            cloud += (1 - latitude) * 0.05;
            cloud = (cloud - 0.5) * 2.0 + 0.5;
cloud = clamp(cloud, 0, 1);

            // Soft threshold
            let alpha = (cloud - 0.52) / 0.18;
            alpha = clamp(alpha, 0, 1);
            alpha = Math.random() * 255;
            alpha = cloud;

// increase contrast
alpha = (alpha - 0.5) * 4.0 + 0.5;

alpha = clamp(alpha, 0, 1) * 255;

            //alpha = alpha * alpha;

            const c = Math.floor(cloud * 255);


            cloudCanvas.image.data[index]     = c;
            cloudCanvas.image.data[index + 1] = c;
            cloudCanvas.image.data[index + 2] = c;
            cloudCanvas.image.data[index + 3] = 255;

                this.colorise(color, ice, medium, fine, polar, cracks);
                textureCanvas.setImgData(index, color);
            }
        }
        textureCanvas.putImgData();
        bumpCanvas.putImgData();
        cloudCanvas.putImgData();
        return { tex: textureCanvas.actual, bump: bumpCanvas.actual, clouds: cloudCanvas.actual };
    }
    colorise(color, ice, medium, fine, polar, cracks) {
        color.reset();
        // Deep frozen ocean
        if (ice < 0.28) 
            color.setRgba(20, 45, 90);
        // Dark blue ice fields
        else if (ice < 0.45) 
            color.setRgba(
                50 + medium * 50,
                110 + medium * 60,
                170 + medium * 60
            );
        // Blue-white fractured ice
        else if (ice < 0.65) 
            color.setRgba(
                130 + fine * 60,
                180 + fine * 50,
                220 + fine * 35
            );
        // Bright ice ridges
        else 
            color.setRgba(
                210 + fine * 30,
                225 + fine * 25,
                245 + fine * 10
            );

        color.scalarAdd(polar);
        // Dark winding cracks
        if (cracks < 0.16) 
            color.multiplyBy(0.55, 0.65, 0.8);
        // Random icy sparkle
        if (fine > 0.85) 
            color.scalarAdd(20);
    }
    createTexture(three, canvas) {
        const texture = new three.CanvasTexture(canvas);
        texture.wrapS = three.RepeatWrapping;
        texture.wrapT = three.ClampToEdgeWrapping;
        return texture;
    }
    addToScene(scene) {
        scene.add(this.group);
    }
    update(camera) {
        this.group.rotation.x += 0.0001;
    }
}