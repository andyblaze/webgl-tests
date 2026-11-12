export default class Terrain {
    constructor(three, sz, segs) {
        this.three = three;
        this.material = new three.MeshPhysicalMaterial({color: 0xffffff});
        this.geometry = new three.PlaneGeometry(sz, sz, segs, segs);
        // Rotate plane to lie horizontally
        this.geometry.rotateX(-Math.PI / 2);    
    }
    setShadows(recv, cast) {
        this.terrain.receiveShadow = recv;
        this.terrain.castShadow = cast; 
        return this;
    }
    setMaterial(m) {
        this.material.dispose();
        this.material = new this.three.MeshPhysicalMaterial(m);
        this.terrain = new this.three.Mesh(this.geometry, this.material);
        return this;
    }
    get native() {
        return this.terrain;
    }
    terraform(deformer) {        
        const positions = this.geometry.attributes.position;
        deformer.apply(positions);
        positions.needsUpdate = true;
        this.geometry.computeVertexNormals(); 
        return this;
    }
    addTo(scene) {
        scene.add(this.terrain);
    }
}
