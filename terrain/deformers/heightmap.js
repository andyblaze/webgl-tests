export default class Heightmap {

    constructor(options = {}) {
        this.maxHeight = 12;
        this.invert = false;
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

        // TODO: Load image

        this.prepareCanvas();

        this.extractPixels();

        return this;
    }

    // Create canvas and draw image
    prepareCanvas() {

        // TODO: Create canvas
        // TODO: Set canvas dimensions
        // TODO: Get 2D context
        // TODO: Draw image
    }

    // Extract image pixel data
    extractPixels() {

        // TODO: Read canvas pixel data
    }

    // Retrieve interpolated height at normalised coordinates
    getHeight(x, z) {

        // TODO: Map coordinates to pixel coordinates
        // TODO: Bilinear interpolation
        // TODO: Return normalised height
    }

    // Apply heightmap to terrain geometry
    apply(positions) {

        // TODO: Iterate through vertices
        // TODO: Map vertex coordinates to normalised coordinates
        // TODO: Get height
        // TODO: Set vertex Y position
        return this;
    }
}
