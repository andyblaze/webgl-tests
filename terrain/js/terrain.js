export default class Terrain {
    constructor(three, sz, segs) {
        this.three = three;
        this.material = new three.MeshPhysicalMaterial({
            color: 0xffffff
        });
        this.geometry = new three.PlaneGeometry(sz, sz, segs, segs);
        this.terrain = new three.Mesh(this.geometry, this.material);
    }
    setRotation(x, y, z) { 
        this.geometry.rotateX(x);
        this.geometry.rotateY(y);
        this.geometry.rotateZ(z);
        return this;
    }
    setPosition(x, y, z) {
        this.terrain.position.set(x, y, z);
        return this;
    }
    rotate(r) {
        this.terrain.rotateY(r);
        return this;
    }
    setShadows(recv, cast) {
        this.terrain.receiveShadow = recv;
        this.terrain.castShadow = cast;
        return this;
    }
    setMaterial(m) {
        const oldMaterial = this.material;
        this.material = new this.three.MeshPhysicalMaterial(m);
        this.terrain.material = this.material;
        oldMaterial.dispose();
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
        return this;
    }
}
