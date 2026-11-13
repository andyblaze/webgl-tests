export default class Heightmap {

    constructor(options = {}) {
        this.maxHeight = 12;
        this.invert = false;
        this.terrainSize = 20;
        Object.assign(this, options);

        this.image = null;
        this.canvas = null;
        this.context = null;
        this.pixels = null;

        this.width = 0;
        this.height = 0;
    }
    // Load the heightmap image
    async load(filename) {
        this.image = await new Promise((resolve, reject) => {
            const image = new Image();
            image.onload = () => resolve(image);
            image.onerror = () => {
                reject(new Error(`Failed to load heightmap: ${filename}`));
            };
            image.src = filename;
        });
        this.prepareCanvas();
        this.extractPixels();
        return this;
    }

    // Create canvas and draw image
    prepareCanvas() {
        this.canvas = document.createElement("canvas");
        this.canvas.width = this.image.width;
        this.canvas.height = this.image.height;
        this.context = this.canvas.getContext("2d");
        this.context.drawImage(this.image, 0, 0);
        this.width = this.image.width;
        this.height = this.image.height;
    }

    // Extract image pixel data
    extractPixels() {
        const imageData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
        this.pixels = imageData.data;
    }

    // Retrieve interpolated height at normalised coordinates
    getHeight(x, z) {

        // Map normalised coordinates to pixel coordinates
        const px = x * (this.width - 1);
        const py = z * (this.height - 1);

        // Find surrounding pixel coordinates
        const x0 = Math.floor(px);
        const x1 = Math.min(x0 + 1, this.width - 1);

        const y0 = Math.floor(py);
        const y1 = Math.min(y0 + 1, this.height - 1);

        // Calculate interpolation weights
        const tx = px - x0;
        const ty = py - y0;

        // Retrieve pixel brightness (grayscale)
        const getPixel = (x, y) => {
            const index = (y * this.width + x) * 4;

            return this.pixels[index];
        };

        // Read surrounding pixel values
        const h00 = getPixel(x0, y0);
        const h10 = getPixel(x1, y0);
        const h01 = getPixel(x0, y1);
        const h11 = getPixel(x1, y1);

        // Bilinear interpolation
        const top = h00 + (h10 - h00) * tx;
        const bottom = h01 + (h11 - h01) * tx;

        const height = top + (bottom - top) * ty;

        // Return normalised height (0-1)
        let normalised = height / 255;

        if (this.invert) {
            normalised = 1 - normalised;
        }
        return normalised;
    }

    // Release temporary image resources
    dispose() {
        this.image = null;
        this.canvas = null;
        this.context = null;
        this.pixels = null;
        this.width = 0;
        this.height = 0;
        return this;
    }

    // Apply heightmap to terrain geometry
    apply(positions) {
        let minX = Infinity;
        let maxX = -Infinity;
        let minZ = Infinity;
        let maxZ = -Infinity;

        for (let i = 0; i < positions.count; i++) {
            const x = positions.getX(i);
            const z = positions.getZ(i);

            minX = Math.min(minX, x);
            maxX = Math.max(maxX, x);
            minZ = Math.min(minZ, z);
            maxZ = Math.max(maxZ, z);
        }
        for (let i = 0; i < positions.count; i++) {

            // Get vertex coordinates
            const x = positions.getX(i);
            const z = positions.getZ(i);

            // Map coordinates to normalised coordinates (0-1)
            const nx = (x - minX) / (maxX - minX);
            const nz = (z - minZ) / (maxZ - minZ);

            // Get height from heightmap
            const height = this.getHeight(nx, nz);
            // Set vertex Y position
            positions.setY(i, height * this.maxHeight);
        }
        this.dispose();
        return this;
    }
}
