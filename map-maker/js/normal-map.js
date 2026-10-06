export default class NormalMap {

    constructor(size, canvas) {
        this.size = size;
        this.image = canvas.createImage(size);
    }

    make(heightMap, strength) {

        for (let y = 0; y < this.size; y++) {
            for (let x = 0; x < this.size; x++) {

                const leftX  = Math.max(0, x - 1);
                const rightX = Math.min(this.size - 1, x + 1);

                const upY   = Math.max(0, y - 1);
                const downY = Math.min(this.size - 1, y + 1);

                const i = x + y * this.size;

                const left  = heightMap[leftX + y * this.size];
                const right = heightMap[rightX + y * this.size];

                const up   = heightMap[x + upY * this.size];
                const down = heightMap[x + downY * this.size];

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