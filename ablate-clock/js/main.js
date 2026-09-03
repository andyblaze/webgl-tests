import * as THREE from "three";
const scene = new THREE.Scene();
const aspect = window.innerWidth / window.innerHeight;

const camera = new THREE.PerspectiveCamera( 65, aspect, 0.1, 100 );
camera.position.set(0, 0, 10);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);

class Config {
    constructor() {
        this.now = new Date();
        this.hands = {
            secondHand: {
                segments: 40, length: 5,
                width: 0.06, angle: 0,
                speed:  Math.PI / 30, direction: -1,
                position: (this.now.getSeconds() / 60) * Math.PI / 2
            },
            minuteHand: {
                segments: 40, length: 5,
                width: 0.06, angle: 0,
                speed:  Math.PI / 30 / 60, direction: -1,
                position: (
                    Math.PI / 2 +
                    (this.now.getMinutes() + this.now.getSeconds() / 60)
                    * Math.PI / 30
                )
            },
            hourHand: {
                segments: 40, length: 3,
                width: 0.06, angle: 0,
                speed: Math.PI / 6 / 60 / 60, direction: -1,
                position: (
                    Math.PI / 2 +
                    (
                        (this.now.getHours() % 12) +
                        this.now.getMinutes() / 60 +
                        this.now.getSeconds() / 3600
                    ) * Math.PI / 6
                )
            }
        }
    }
}
const config = new Config();

class Hand {
    constructor(three, name, cfg) {
        this.name = name;
        // Hand geometry & setup
        Object.assign(this, {...cfg.hands[name]});

        this.angle = this.position - Math.PI / 2;

        this.positions = new Float32Array((this.segments + 1) * 2 * 3);
        this.indices = [];

        for ( let i = 0; i < this.segments; i++ ) {
            const a = i * 2;
            const b = a + 2;

            this.indices.push(
                a, a + 1, b,
                a + 1, b + 1, b
            );
        }

        this.geometry = new three.BufferGeometry();
        this.geometry.setAttribute(
            "position",
            new three.BufferAttribute(this.positions, 3)
        );
        this.geometry.setIndex(this.indices);

        this.material = new THREE.MeshBasicMaterial({
            color: 0x00ffff,
            side: three.DoubleSide
        });

        this.threeObj = new three.Mesh(this.geometry, this.material);
    }
    get native() {
        return this.threeObj;
    }
    updateGeometry(index, x, y) {
        const pos = this.geometry.attributes.position.array;
        const halfWidth = this.width / 2; 

        pos[index + 0] = x;
        pos[index + 1] = y - halfWidth;
        pos[index + 2] = 0;

        pos[index + 3] = x;
        pos[index + 4] = y + halfWidth;
        pos[index + 5] = 0;   
    }
    update(dt) {
        this.angle += dt * this.speed * this.direction;
        this.threeObj.rotation.z = this.angle;

        const flexibleStart = 0.125;
        const maxBend = this.speed * -this.direction;//0.3; // radians
        let x = 0;
        let y = 0;

        for ( let i = 0; i <= this.segments; i++ ) {
            const t = i / this.segments;
            // Work out the bend of this segment.
            let bend = 0;

            if ( t > flexibleStart ) {
                const flexT = (t - flexibleStart) / (1 - flexibleStart);
                bend = (1 - Math.cos(flexT * Math.PI / 2)) * maxBend;
            }

            // Position the segment.
            if ( i > 0 ) {
                const segmentLength = this.length / this.segments;
                x += Math.cos(bend) * segmentLength;
                y += Math.sin(bend) * segmentLength;
            }
            const index = i * 2 * 3;
            this.updateGeometry(index, x, y);
        }
        this.geometry.attributes.position.needsUpdate = true;
    }
}
const secondHand = new Hand(THREE, "secondHand", config);
scene.add(secondHand.native);
const minuteHand = new Hand(THREE, "minuteHand", config);
scene.add(minuteHand.native);
const hourHand = new Hand(THREE, "hourHand", config);
scene.add(hourHand.native);


// Animation
const timer = new THREE.Clock();

function phaser(elapsed) {
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



        //const seconds = now.getSeconds();

function animate() {
    const dt = timer.getDelta();
    const elapsed = timer.getElapsedTime(); // might need later

    //secondHand.speed = phaser(elapsed);//(Math.sin(elapsed * 0.4) + 1) * 0.3;
    //const now = new Date();
    //console.log(now.getSeconds());
    secondHand.update(dt);
    minuteHand.update(dt);
    hourHand.update(dt);
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

requestAnimationFrame(animate);

window.addEventListener("resize", () => {
    const aspect = window.innerWidth / window.innerHeight;

    camera.left = -10 * aspect;
    camera.right = 10 * aspect;
    camera.top = 7.5;
    camera.bottom = -7.5;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
});