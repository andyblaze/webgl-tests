function byId(elID) {
    return document.getElementById(elID);
}

export function makeLights(three, scene) {
    const hemi = new three.HemisphereLight(0xffffff, 0x444444, 0.8);
    hemi.position.set(0, 2, 0);
    scene.add(hemi);

    const dir = new three.DirectionalLight(0xffffff, 0.8);
    dir.position.set(5, 10, 7);
    dir.castShadow = true;
    scene.add(dir);
}

export function makeRenderer(three, id) {
    const renderer = new three.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    byId(id).appendChild(renderer.domElement);
    return renderer;
}