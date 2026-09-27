export default class Bend {
    constructor(three, curve) {
        this.three = three;
        this.curve = curve;
        this.minSegments = 64;
    }
    applyTo(shape) {
        const geometry = shape.geometry;
        const height = shape.height;
        const position = geometry.attributes.position;

        const point = new this.three.Vector3();
        const tangent = new this.three.Vector3();

        // We'll use this to rotate the cone's original Y axis
        // so that it follows the curve.
        const quaternion = new this.three.Quaternion();
        const axis = new this.three.Vector3(0, 1, 0);
        const offset = new this.three.Vector3();

        for ( let i = 0; i < position.count; i++ ) {

            // Original position on the straight cone
            const x = position.getX(i);
            const y = position.getY(i);
            const z = position.getZ(i);

            // How far along the cone?
            const t = y / height;

            // Where are we on the curve?
            this.curve.getPointAt(t, point);

            // Which direction is the curve travelling here?
            this.curve.getTangentAt(t, tangent);

            // Rotate the cone's Y axis so it points
            // along the curve.
            quaternion.setFromUnitVectors(axis, tangent);

            // Take the vertex's distance from the cone centre
            // and rotate that around the curve.
            offset.set(x, 0, z);

            offset.applyQuaternion(quaternion);

            // Put the vertex around the curve.
            position.setXYZ(
                i,
                point.x + offset.x,
                point.y + offset.y,
                point.z + offset.z
            );
        }

        position.needsUpdate = true;        
    }
}