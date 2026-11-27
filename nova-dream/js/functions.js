export function byId(id) {
    return document.getElementById(id);
}

export function makeRenderer(three, canvas) {
    const rdr = new three.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance'
    });

    rdr.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    rdr.setSize(window.innerWidth, window.innerHeight);

    // Colour management
    rdr.outputColorSpace = three.SRGBColorSpace;

    rdr.toneMapping = three.ACESFilmicToneMapping;
    rdr.toneMappingExposure = 1.0;

    // Black background
    rdr.setClearColor(0x000000, 1);
    return rdr;
}

export function makeCamera(three) {
    const cam = new three.PerspectiveCamera(
        55,                                     // FOV
        window.innerWidth / window.innerHeight,
        0.1,                                    // Near clipping
        1000                                    // Far clipping
    );

    cam.position.set(0, 0, 24);

    cam.lookAt(0, 0, 0);  
    return cam;  
}

export function makeScene(three) {
    const s = new three.Scene();
    s.background = new three.Color(0x000000);
    return s;
}
