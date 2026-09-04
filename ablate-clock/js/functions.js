export function makeCamera(three, cfg) {
    const cam = new three.PerspectiveCamera( 65, cfg.aspect, 0.1, 100 );
    cam.position.set(0, 0, 10);
    cam.lookAt(0, 0, 0);  
    return cam;  
}

export function makeRenderer(three, cfg) {
    const rndr = new three.WebGLRenderer({ antialias: true });
    rndr.setSize(cfg.innerW, cfg.innerH);
    rndr.setPixelRatio(Math.min(cfg.dpr, 2));
    document.body.appendChild(rndr.domElement);   
    return rndr; 
}

export function phaser(elapsed, maxSpeed, duration) {
    const phase = elapsed * 2 * Math.PI / duration;
    return 1 + (maxSpeed - 1) * (1 - Math.cos(phase)) / 2;
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