export default class Smoothing {

    constructor() {
        this.iterations = 1;
        this.strength = 0.125;
    }
    apply(positions) {

        const count = positions.count;

        // Cache original heights
        let heights = new Float32Array(count);

        for (let i = 0; i < count; i++) {
            heights[i] = positions.getY(i);
        }

        const resolution = Math.round(Math.sqrt(count));
        
        for (let iteration = 0; iteration < this.iterations; iteration++) {

            const smoothed = new Float32Array(heights);

            for (let z = 1; z < resolution - 1; z++) {
                for (let x = 1; x < resolution - 1; x++) {

                    const i = z * resolution + x;

                    // Average neighbouring heights
                    const average = (
                        heights[i - 1] +
                        heights[i + 1] +
                        heights[i - resolution] +
                        heights[i + resolution]
                    ) / 4;

                    // Blend original and averaged heights
                    smoothed[i] = heights[i] +
                        (average - heights[i]) * this.strength;
                }
            }

            heights = smoothed;
        }

        // Write results back to geometry
        for (let i = 0; i < count; i++) {
            positions.setY(i, heights[i]);
        }
    }
}
