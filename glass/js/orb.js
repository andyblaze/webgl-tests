class PaperMask {
    static tex = null;
    static create(three) {
        if ( PaperMask.tex !== null ) return PaperMask.tex;
        const size = 64;
        const canvas = document.createElement("canvas");
        canvas.width = canvas.height = size;

        const ctx = canvas.getContext("2d");

        const img = ctx.createImageData(size,size);

        for ( let i = 0; i < img.data.length; i += 4 ){
            //const v = Math.random() * 255;
            const v = 120 + Math.random() * 80;
            img.data[i] = v;
            img.data[i+1] = v;
            img.data[i+2] = v;
            img.data[i+3] = v;
        }

        ctx.putImageData(img,0,0);
        //document.body.append(canvas);

        PaperMask.tex = new three.CanvasTexture(canvas);
        return PaperMask.tex;
    }
}

export default class Orb {
    constructor(three, x, col) {
        this.grp = new three.Group();
        this.grp.position.x = x;

        // Tiny glowing bulb
        this.core = new three.Mesh(
            new three.SphereGeometry(0.08, 32, 32),
            new three.MeshStandardMaterial({
                color: 0x000000,
                emissive: col,
                emissiveIntensity: 4
            })
        );

        this.shell = new three.Mesh(
            new three.SphereGeometry(1, 64, 64),
            new three.MeshPhysicalMaterial({
                color: col,
                transmission: 0.095,
                thickness: 10.92,
                roughness: 0.855,
                ior: 1.4,
                metalness: 0.84,
                transparent: false,
                side: three.BackSide
            })
        );

const paper = PaperMask.create(three);

this.shell.material.alphaMap = paper;
this.shell.material.transparent = true;
this.shell.material.transmission = 0.5;
this.shell.material.roughness = 0.6;

this.diffuser = new three.Mesh(
    new three.SphereGeometry(0.75, 64, 64),
    new three.MeshBasicMaterial({
        color: col,
        transparent: true,
        opacity: 0.0015,
        //blending: three.AdditiveBlending,
        depthWrite: false,
        side: three.BackSide
    })
);

        this.shell.renderOrder = 1;
        this.diffuser.renderOrder = 2;
        this.core.renderOrder = 3;

        this.diffuser.material.depthWrite = false;
        this.shell.material.depthWrite = false;

        // Actual light
        this.light = new three.PointLight(col, 1, 1);

        this.grp.add(this.diffuser, this.shell, this.light);
    }

    update(elapsed, i) {
        this.grp.position.y = Math.sin(elapsed + i) * 0.25;
        this.grp.rotation.y += 0.003;
    }

    addToScene(scene) {
        scene.add(this.grp);
    }
}