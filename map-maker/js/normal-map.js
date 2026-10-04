export default class NormalMap {
    constructor(size, canvas) {
        this.size = size;
        this.image = canvas.createImage(size);
    }
    make(heightMap, strength=1) {
        for (let y = 1; y < this.size - 1; y++) {
            for (let x = 1; x < this.size - 1; x++) {
                const i = x + y * this.size;

                const left  = heightMap[i - 1];
                const right = heightMap[i + 1];

                const up   = heightMap[i - this.size];
                const down = heightMap[i + this.size];

                const dx = (right - left) * strength;
                const dy = (down - up) * strength;

                let nx = -dx;
                let ny = -dy;
                let nz = 1;

                const length = Math.sqrt(nx * nx + ny * ny + nz * nz);

                nx /= length;
                ny /= length;
                nz /= length;

                const idx = i * 4;

                this.image.data[idx + 0] = (nx * 0.5 + 0.5) * 255;
                this.image.data[idx + 1] = (ny * 0.5 + 0.5) * 255;
                this.image.data[idx + 2] = (nz * 0.5 + 0.5) * 255;
                this.image.data[idx + 3] = 255;
            }
        }
    }
}
