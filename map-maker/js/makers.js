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

export function makeShape(three, scene) {
    const geometry = new three.BoxGeometry(2, 2, 2);
    const material = new three.MeshPhysicalMaterial({
        color: 0xffffff,
        roughness: 0.5, metalness: 0.5,
        anisotropy: 1
    });

    const shape = new three.Mesh(geometry, material);
    scene.add(shape);
    return shape;
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
}
