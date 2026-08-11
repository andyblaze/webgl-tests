export default class Factory {
    static init(registry) {
        Factory.registry = registry;
    }
    static createGeometry(type) {
        const geo = this.registry.geometries[type];
        return new geo.ctor(...geo.defaults);
    }
    static createMaterial(type, cfg) {
        const mat = this.registry.materials[type];
        return new mat.ctor(cfg);
    }
}
