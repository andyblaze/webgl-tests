function byId(elID) {
    return document.getElementById(elID);
}

export function makeLights(three, scene, cfg) {
    const { hemi, red, green, blue } = {...cfg};
    const hemi1 = new three.HemisphereLight(hemi.start, hemi.stop, hemi.strength);
    hemi1.position.copy(hemi.position);
    scene.add(hemi1);

    //reddish
    const dir1 = new three.DirectionalLight(red.color, red.strength);
    dir1.position.copy(red.position);
    dir1.castShadow = true;
    scene.add(dir1);

    // blueish
    const dir2 = new three.DirectionalLight(blue.color, blue.strength);
    dir2.position.copy(blue.position);
    dir2.castShadow = true;
    scene.add(dir2);    

    // greenish
    const dir3 = new three.DirectionalLight(green.color, green.strength);
    dir3.position.copy(green.position);
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