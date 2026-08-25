export function makeCamera(three) {
    const cam = new three.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    cam.position.set(0, 0, 25);
    //cam.position.set(12, 8, 15);
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

export function degToRad(degrees) {
    return degrees * Math.PI / 180;
}

export function mt_rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function mt_randf(min, max) {
    return Math.random() * (max - min) + min;
}

export function randomFrom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

export function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

export function lerp(a, b, t) {
    return a + (b - a) * t;
}