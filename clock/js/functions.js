export function makeCamera(three) {
    const cam = new three.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    cam.position.set(10, 8, 10);
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
    const ambientLight = new three.HemisphereLight(0xffffff, 0x333333, 2);
    scene.add(ambientLight);

    const directionalLight = new three.DirectionalLight(0xffffff, 3);
    directionalLight.position.set(5, 10, 5);
    scene.add(directionalLight);
}