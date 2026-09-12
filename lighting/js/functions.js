export function byId(id) {
    return document.getElementById(id);
}

export function makeCamera(three, cfg) {
    const cam = cfg.camera;
    const camera = new three.PerspectiveCamera(cam.fov, cam.aspect, cam.near, cam.far);
    camera.position.copy(cam.pos);
    camera.lookAt(cam.target);
    return camera;
}

export function makeRenderer(three, cfg) {
    const rndr = new three.WebGLRenderer({ antialias: true, alpha: true });
    rndr.setClearColor(0x000000, 0);
    rndr.setSize(cfg.innerW, cfg.innerH);
    rndr.setPixelRatio(Math.min(cfg.dpr, 2));
    rndr.shadowMap.enabled = true;
    byId(cfg.canvasParent).appendChild(rndr.domElement);   
    return rndr; 
}

export function deg2rad(degrees) {
    return degrees * Math.PI / 180;
}

export function mt_rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function mt_randf(min, max) {
    return Math.random() * (max - min) + min;
}

export function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

export function randomFrom(arr) {
    return arr[mt_rand(0, arr.length - 1)];
}
