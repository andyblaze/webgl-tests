function byId(elID) {
    return document.getElementById(elID);
}

export function makeLights(three, scene) {
    const hemi = new three.HemisphereLight(0xffffff, 0x444444, 0.58);
    hemi.position.set(0, 2, 0);
    scene.add(hemi);

    //reddish
    const dir1 = new three.DirectionalLight(0xFF00FF, 3);
    dir1.position.set(2, 3, 8);
    dir1.castShadow = true;
    scene.add(dir1);

    // blueish
    const dir2 = new three.DirectionalLight(0x8080FF, 3);
    dir2.position.set(-4, 2, -6);
    dir2.castShadow = true;
    scene.add(dir2);

    // greenish
    const dir3 = new three.DirectionalLight(0xB2FF43, 2);
    dir3.position.set(-4, -4, -6);
    dir3.castShadow = true;
    scene.add(dir3);
}

export function makeRenderer(three, id) {
    const renderer = new three.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    byId(id).appendChild(renderer.domElement);
    return renderer;
}