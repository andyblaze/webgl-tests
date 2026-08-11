export default class Registry {
    static init(three) {
        Registry.geometries = {
            sphere: { ctor: three.SphereGeometry, defaults: [15, 32, 16] },
            box: { ctor: three.BoxGeometry, defaults: [6, 6, 6] },
            torus: { ctor: three.TorusGeometry, defaults: [6, 3, 16, 100] },
            torusknot: { ctor: three.TorusKnotGeometry, defaults: [4, 1, 128, 16] },
            capsule: { ctor: three.CapsuleGeometry, defaults: [1, 1, 4, 8, 1] },
            cylinder: { ctor: three.CylinderGeometry, defaults: [5, 5, 20, 32] }
        }
        Registry.materials = {
            basic: { ctor: three.MeshBasicMaterial },
            phong: { ctor: three.MeshPhongMaterial },
            physical: { ctor: three.MeshPhysicalMaterial },
            standard: { ctor: three.MeshStandardMaterial },
            lambert: { ctor: three.MeshLambertMaterial }
        }
    }
}
