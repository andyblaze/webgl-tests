export default class MaterialsData {
    constructor(three) {
        this.data = {
            floor: { 
                color: 0xffffff, side: three.DoubleSide,
                metalness:0.15, roughness: 0.85,
                emissive:0xff0000, emissiveIntensity: 0.1,
                clearcoat: 1, clearcoatRoughness: 0.5,
                anisotropy: 1,
                normalMap: {
                    tex: "textures/brush-normal.png",
                    normalScale: new three.Vector2(2, 2),
                    repeat: 4
                },
                map: {
                    tex: "textures/tiles.jpg",
                    repeat: 1
                }
            },
            iceWorld: {
                color: 0x00ffff,
                roughness: 0.5, metalness: 0.5,
                clearcoat: 0.75, clearcoatRoughness: 0.5,
                emissive: 0x0080ff, emissiveIntensity: 0.25,
                sheenColor: 0xf471c7, sheen: 1,//,
                anisotropy: 1,
                normalMap: {
                    tex: "textures/cloud-normal.png",
                    normalScale: new three.Vector2(2, 2),
                    repeat: 2
                },
                map: {
                    tex: "textures/pave.png",
                    repeat: 1
                }
            },
            fireWorld: {
                color: 0xff0000,
                roughness: 0.5, metalness: 0.5,
                clearcoat: 0.75, clearcoatRoughness: 0.5,
                emissive: 0x990000, emissiveIntensity: 0.5,
                sheenColor: 0xf41137, sheen: 1,
                anisotropy: 1,
                normalMap: {
                    tex: "textures/cloud-normal.png",
                    normalScale: new three.Vector2(2, 2),
                    repeat: 2
                },
                map: {
                    tex: "textures/pave.png",
                    repeat: 1
                }
            },
            moonWorld: {
                color: 0xa57e22,
                roughness: 0.085, metalness: 0.05,
                //clearcoat: 0.75, clearcoatRoughness: 0.5,
                emissive: 0xa57e22, emissiveIntensity: 1,
                //sheenColor: 0x113237, sheen: 1,
                //anisotropy: 1,
                emissiveMap: {
                    tex: "textures/moon.jpg",
                    //normalScale: new three.Vector2(2, 2),
                    repeat: 1
                },
                map: {
                    tex: "textures/pebbles.png",
                    repeat: 1
                }
            },
            cloud: {
                color: 0xffffff,
                transparent: true,
                opacity: 0.25,
                emissive: 0xffffff, emissiveIntensity: 0.5,
                //roughness: 1,
                emissiveMap: {
                    tex: "textures/tile-clouds.png",
                    repeat: 2
                }
            },
            cloud2: {
                color: 0xffffff,
                transparent: true,
                opacity: 0.25,
                emissive: 0xffffff, emissiveIntensity: 0.5,
                //roughness: 1,
                emissiveMap: {
                    tex: "textures/tile-clouds2.png",
                    repeat: 2
                }
            },
            brushedBrass: {
                color: 0xd2c628,
                roughness: 0.7, metalness: 0.3,
                clearcoat: 0.75, clearcoatRoughness: 0.25,
                emissive: 0xe0b347, emissiveIntensity: 0.5,
                sheenColor: 0xc5e21d, sheen: 0.2,
                anisotropy: 0,
                normalMap: {
                    tex: "textures/marble-normal.png",
                    normalScale: new three.Vector2(2, 2),
                    repeat: 2
                },
                map: {
                    tex: "textures/brush.png",
                    repeat: 1
                }
            },
            pinkMetal: {
                color: 0xffffff,
                roughness: 0.75, metalness: 0.15,
                transparent: true, opacity: 0.75,
                clearcoat: 1, clearcoatRoughness: 0.5,
                emissive: 0x95a5e9, emissiveIntensity: 0.75,
                sheenColor: 0xffeeff, sheen: 0.68,
                anisotropy: 0,
                attenuationColor: 0xf8aaa2,
                normalMap: {
                    tex: "textures/pebbles-normal.png",
                    normalScale: new three.Vector2(2, 2),
                    repeat: 2
                },
                alphaMap: {
                    tex: "textures/pebbles.png",
                    repeat: 1
                }
            },
            brushedMetal: {
                color: 0xbcbcbc,
                roughness: 0.5, metalness: 0.4,
                clearcoat: 1, clearcoatRoughness: 0.5,
                emissive: 0xc0c0c0, emissiveIntensity: 0.25,
                sheenColor: 0xc0c0c0, sheen: 1,
                anisotropy: 1,
                attenuationColor: 0xf80762,
                normalMap: {
                    tex: "textures/brush-normal.png",
                    normalScale: new three.Vector2(2, 2),
                    repeat: 2
                },
                map: {
                    tex: "textures/brush.png",
                    repeat: 1
                }
            }
        };
    }
}