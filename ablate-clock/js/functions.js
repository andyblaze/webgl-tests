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

export function phaser(elapsed) {
    return Math.sin(elapsed * 0.15 * Math.PI) * 0.6;
    /*const phase = (elapsed * 0.15) % 2;

    let speed = 0;

    if (phase < 1) {
        const t = phase;
        speed = (t * t * (3 - 2 * t) * 2 - 1) * 0.6;
    } else {
        const t = phase - 1;
        speed = ((1 - t * t * (3 - 2 * t)) * 2 - 1) * 0.6;
    }

    return speed;*/
}
