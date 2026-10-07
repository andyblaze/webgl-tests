export function makeRenderer(three, container) {
    const renderer = new three.WebGLRenderer({
        antialias: true
    });
    renderer.setSize(
        512, 512 //container.clientWidth,
        //container.clientHeight
    );
    renderer.domElement.style.display = "inline-block";
    container.appendChild(renderer.domElement);
    return renderer;
}

export function makeCamera(three, w, h) {
    const camera = new three.PerspectiveCamera(
        45,
        w / h,
        0.1,
        100
    );
    camera.position.z = 5;
    return camera;
}

function makeGeo(three, type) {
    switch (type) {
        case "sphere" : return new three.SphereGeometry(1.5, 128, 128);
        case "box" : return new three.BoxGeometry(2, 2, 2);
        case "cone" : return new three.ConeGeometry(1.25, 2, 128, 128);
        case "cylinder" : return new three.CylinderGeometry(0.75, 0.75, 2.5, 128, 128);
        case "capsule" : return new three.CapsuleGeometry(1, 1, 128, 128, 128);
        case "dodecahedron" : return new three.DodecahedronGeometry(1.5);
        case "torus" : return new three.TorusGeometry(1.25, 0.25, 512, 512);
        case "torusknot" : return new three.TorusKnotGeometry(1.05, 0.25, 512, 512);
    }    
}

export function makeShape(three, type) {
    const geometry = makeGeo(three, type);
    const material = new three.MeshPhysicalMaterial({
        color: 0xffffff,
        roughness: 0.5, metalness: 0.5,
        anisotropy: 1
    });

    //const shape = new three.Mesh(geometry, material);
    return new three.Mesh(geometry, material);
}

export function makeLights(three, scene) {
    const red = new three.SpotLight(0xff0000, 50);
    red.position.set(-5, 5, 5);
    red.target.position.set(0, 0, 0);

    scene.add(red);
    scene.add(red.target);


    const blue = new three.SpotLight(0x0000ff, 50);
    blue.position.set(5, 5, 5);
    blue.target.position.set(0, 0, 0);

    scene.add(blue);
    scene.add(blue.target);


    const green = new three.SpotLight(0x00ff00, 50);
    green.position.set(0, -5, 5);
    green.target.position.set(0, 0, 0);

    scene.add(green);
    scene.add(green.target);

    const backLight = new three.DirectionalLight(0xffffff, 0.5);

    backLight.position.set(-2, 3, -5);
    backLight.target.position.set(0, 0, 0);

    scene.add(backLight);
    scene.add(backLight.target);
}
