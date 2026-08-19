export function makeCamera(three) {
    const cam = new three.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    cam.position.set(0, 0, 15);
    cam.lookAt(0, 0, 0);
    return cam;
}

export function makeRenderer(three) {
    const rndr = new three.WebGLRenderer({ antialias: true });
    rndr.setSize(window.innerWidth, window.innerHeight);
    rndr.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    document.body.appendChild(rndr.domElement);
    return rndr;
}

export function makeLights(three, scene) {
    const amb = new three.HemisphereLight(0xffffff, 0x333333, 2);
    scene.add(amb);

    const dir1 = new three.DirectionalLight(0xff8000, 4);
    dir1.position.set(10, 5, 5);
    scene.add(dir1);

    const dir2 = new three.DirectionalLight(0xffffff, 3);
    dir2.position.set(-10, -5, -5);
    scene.add(dir2);
}

export function degToRad(degrees) {
    return degrees * Math.PI / 180;
}