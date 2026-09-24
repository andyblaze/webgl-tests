import Box from "./shapes/box.js";
import Sphere from "./shapes/sphere.js";
import Capsule from "./shapes/capsule.js";
import Cone from "./shapes/cone.js";
import Cylinder from "./shapes/cylinder.js";
import Dodecahedron from "./shapes/dodecahedron.js";
import Icosahedron from "./shapes/icosahedron.js";
import Octahedron from "./shapes/octahedron.js";
import Plane from "./shapes/plane.js";
import Tetrahedron from "./shapes/tetrahedron.js";
import Torus from "./shapes/torus.js";
import TorusKnot from "./shapes/torusknot.js";
import Bowl from "./shapes/bowl.js";
import FlyingSaucer from "./shapes/alien-ship.js";
import SpikyCube from "./shapes/spiky-cube.js";
import Mirror from "./shapes/mirror.js";
import * as C from "./constants.js";

class ShapeRegistry {
    constructor(three) {
        this.data = {
            bowl: {
                ctor: Bowl,
                defaultGeo: {
                    radius: 1, 
                    widthSegments: 48, heightSegments: 48,
                    phiStart: 0, phiLength: C.DEG360,
                    thetaStart: 0, thetaLength: C.DEG90
                },
                defaultMat: { color: 0xffffff, side: three.DoubleSide }
            },
            box: {
                ctor: Box,
                defaultGeo: {
                    width: 1, height: 1, depth: 1, 
                    widthSegments: 1, heightSegments: 1, depthSegments: 1
                },
                defaultMat: { color: 0xffffff }
            },
            capsule: {
                ctor: Capsule,
                defaultGeo: {
                    radius: 1, height: 1, capSegments: 32,
                    radialSegments: 32, heightSegments: 1
                },
                defaultMat: { color: 0xffffff }
            },
            cone: {
                ctor: Cone,
                defaultGeo: {
                    radius: 1, height: 1, radialSegments: 32, 
                    heightSegments: 32, openEnded: false
                },
                defaultMat: { color: 0xffffff }
            },
            cylinder: {
                ctor: Cylinder,
                defaultGeo: {
                    radiusTop: 1, radiusBottom: 1, height: 1, 
                    radialSegments: 32, heightSegments: 32, openEnded: false
                },
                defaultMat: { color: 0xffffff }
            },
            dodecahedron: {
                ctor: Dodecahedron,
                defaultGeo: {
                    radius: 1, detail: 0
                },
                defaultMat: { color: 0xffffff }
            },
            flowerpot: {
                ctor: Cylinder,
                defaultGeo: {
                    radiusTop: 1, radiusBottom: 0.5, height: 1, 
                    radialSegments: 32, heightSegments: 32, openEnded: false
                },
                defaultMat: { color: 0xffffff }
            },
            flyingSaucer: {
                ctor: FlyingSaucer,
                defaultGeo: {
                    radius: 1, 
                    widthSegments: 48, heightSegments: 48
                },
                defaultMat: { color: 0xffffff }
            },
            icosahedron: {
                ctor: Icosahedron,
                defaultGeo: {
                    radius: 1, detail: 0
                },
                defaultMat: { color: 0xffffff }
            },
            mirror: {
                ctor: Mirror,
                defaultGeo: {
                    width: 5, height: 5,
                    texW: window.innerWidth * window.devicePixelRatio,
                    texH: window.innerHeight * window.devicePixelRatio
                },
                defaultMat: { color: 0xffffff }
            },
            octahedron: {
                ctor: Octahedron,
                defaultGeo: {
                    radius: 1, detail: 0
                },
                defaultMat: { color: 0xffffff }
            },
            plane: {
                ctor: Plane,
                defaultGeo: {
                    width: 1, height: 1,
                    widthSegments: 1, heightSegments: 1
                },
                defaultMat: { color: 0xffffff, side: three.DoubleSide }
            },
            hidefPlane: {
                ctor: Plane,
                defaultGeo: {
                    width: 24, height: 24,
                    widthSegments: 128, heightSegments: 128
                },
                defaultMat: { color: 0xffffff, side: three.DoubleSide }
            },
            sphere: {
                ctor: Sphere,
                defaultGeo: {
                    radius: 1, 
                    widthSegments: 48, heightSegments: 48
                },
                defaultMat: { color: 0xffffff }
            },
            hidefSphere: {
                ctor: Sphere,
                defaultGeo: {
                    radius: 1,
                    widthSegments: 64,
                    heightSegments: 64
                },
                defaultMat: { color: 0xffffff }
            },
            spikyCube: {
                ctor: SpikyCube,
                defaultGeo: {
                    size: 0.5,
                    spikeRadius: 0.08,
                    spikeLength: 2
                },
                defaultMat: {
                    color: 0xffffff
                }
            },            
            spinningTop: {
                ctor: Capsule,
                defaultGeo: {
                    radius: 1, height: 0.1, capSegments: 1,
                    radialSegments: 32, heightSegments: 1
                },
                defaultMat: { color: 0xffffff }
            },
            tetrahedron: {
                ctor: Tetrahedron,
                defaultGeo: {
                    radius: 1, detail: 0
                },
                defaultMat: { color: 0xffffff }
            },
            torus: {
                ctor: Torus,
                defaultGeo: {
                    radius: 1, tube: 0.4, 
                    radialSegments: 16, tubularSegments: 96
                },
                defaultMat: { color: 0xffffff }
            },
            torusknot: {
                ctor: TorusKnot,
                defaultGeo: {
                    radius: 1, tube: 0.25, 
                    radialSegments: 128, tubularSegments: 24
                },
                defaultMat: { color: 0xffffff }
            }
        };
    }
    get(type) {
        return this.data[type];
    }
}

export class ShapeFactory  {
    constructor(three) {
        this.three = three;
        this.registry = new ShapeRegistry(three);
    }
    combine(def, usr) {
        return {
            ...def,
            ...usr
        };
    }
    create(type, cfgGeo={}, cfgMat={}) {
        const def = this.registry.get(type);
        // If only one config object was supplied, treat it as material config.
        if ( arguments.length === 2 ) {
            cfgMat = cfgGeo;
            cfgGeo = {};
        }
        const geo = this.combine(def.defaultGeo, cfgGeo);
        const mat = this.combine(def.defaultMat, cfgMat);
        return new def.ctor(this.three, geo, mat);
    }
}
