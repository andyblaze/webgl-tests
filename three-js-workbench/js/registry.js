export default class Registry {
    static init(three) {
        Registry.geometries = {
            sphere: { ctor: three.SphereGeometry, defaults: [6, 64, 64] },
            box: { ctor: three.BoxGeometry, defaults: [6, 6, 6] },
            torus: { ctor: three.TorusGeometry, defaults: [4, 1.5, 32, 128] },
            torusknot: { ctor: three.TorusKnotGeometry, defaults: [4, 1, 128, 16] },
            capsule: { ctor: three.CapsuleGeometry, defaults: [4, 4, 32, 32, 1] },
            cylinder: { ctor: three.CylinderGeometry, defaults: [4, 4, 8, 64] },
            cone: { ctor: three.ConeGeometry, defaults: [5, 10, 64] },
            dodecahedron: { ctor: three.DodecahedronGeometry, defaults: [5, 0] },
            icosahedron: { ctor: three.IcosahedronGeometry, defaults: [5, 0] },
            octahedron: { ctor: three.OctahedronGeometry, defaults: [5, 0] },
            tetrahedron: { ctor: three.TetrahedronGeometry, defaults: [5, 0] }
        }
        Registry.materials = {
            basic: { ctor: three.MeshBasicMaterial },
            phong: { ctor: three.MeshPhongMaterial },
            physical: { ctor: three.MeshPhysicalMaterial },
            standard: { ctor: three.MeshStandardMaterial },
            lambert: { ctor: three.MeshLambertMaterial }
        }
        Registry.mesh = three.Mesh;
    }
}
