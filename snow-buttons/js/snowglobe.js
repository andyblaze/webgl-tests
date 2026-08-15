//import Background from "./b-ground.js";
//import Rim from "./rim.js";
import Glass from "./glass.js";
//import Particles from "./particles.js";

export default class Snowglobe {
    constructor(three, element, configs) {
      this.element = element;

      const key = element.dataset.color;
      this.config = configs[key];

      this.width = element.clientWidth;
      this.height = element.clientHeight;

      this.scene = new three.Scene();

      const halfW = this.width / 2;
      const halfH = this.height / 2;

      this.camera = new three.OrthographicCamera(-halfW, halfW, halfH, -halfH, -100, 100);
      this.camera.position.z = 10;

      this.renderer = new three.WebGLRenderer({ alpha: true, antialias: true });
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      this.renderer.setSize(this.width, this.height, false);
      this.renderer.outputColorSpace = three.SRGBColorSpace;

      element.insertBefore(this.renderer.domElement, element.firstChild);

      this.group = new three.Group();
      this.scene.add(this.group);

      this.mouse = new three.Vector2(9999, 9999);
      this.mouseTarget = new three.Vector2(9999, 9999);

      this.hover = 0;
      this.hoverTarget = 0;

      const hemi = new three.HemisphereLight(
  0xffffff,
  this.config.color,
  10
);

this.scene.add(hemi);

this.light = new three.DirectionalLight(0xffffff, 5);
this.light.position.set(-parseInt(Math.random() + 50) * 50, parseInt(Math.random() + 50) * 50, parseInt(Math.random() + 100) * 100);

this.scene.add(this.light);

const dir = new three.DirectionalLight(
  0xffffff,
  20
);

dir.position.set(0, 0, 0);
dir.lookAt(0, 0, -10);
this.scene.add(dir);

const rim = new three.DirectionalLight(
  0xffffff,//this.config.color,
  10
);

rim.position.set(10, 16, -3);
rim.lookAt(0, 0, 0);
this.scene.add(rim);

      /*const bgMesh = Background.create(three, this);
      bgMesh.position.z = -2;
      this.group.add(bgMesh);
      this.background = bgMesh;*/

      //this.particles = new Particles(three, this);
      //this.group.add(this.particles.init(three));

      this.glass = Glass.create(three, this);
      //console.log(this.glass);
      //this.glass.position.z = 3;
      //this.glass.rotation.x = 0.12;
//this.glass.rotation.y = -0.18;
      this.glass.rotation.z = Math.PI / 2;
      this.group.add(this.glass);

      /*this.rim = Rim.create(three, this);
      this.group.add(this.rim);*/

      this.bindEvents();
    }

    bindEvents() {
      this.element.addEventListener(
        "pointerenter",
        () => {
          this.hoverTarget = 1;
        }
      );

      this.element.addEventListener(
        "pointerleave",
        () => {
          this.hoverTarget = 0;

          this.mouseTarget.set(
            9999,
            9999
          );
        }
      );

      this.element.addEventListener(
        "pointermove",
        event => {
          const rect = this.element.getBoundingClientRect();

          this.mouseTarget.set(
            event.clientX - rect.left - rect.width / 2,
            -(event.clientY - rect.top - rect.height / 2)
          );
        }
      );
    }

    update(dt, elapsed) {
      //this.glass.rotation.x += 0.001;
      this.light.position.x = Math.sin(elapsed * 0.3) * 100;

      this.light.position.y = Math.cos(elapsed * 0.22) * 50;
    this.glass.material.normalMap.offset.x = elapsed * 0.02;
    this.glass.material.normalMap.offset.y = elapsed * 0.005;
    //this.glass.material.normalMap.offset.z = elapsed * 0.013;

    this.glass.material.roughnessMap.offset.x = elapsed * -0.03;
    this.glass.material.roughnessMap.offset.y = elapsed * 0.005;
    //this.glass.material.roughnessMap.offset.z = elapsed * 0.017;
      //this.glass.update(dt, elapsed);
      //this.particles.update(dt, elapsed, this);
      //this.glass.material.uniforms.hover.value = this.hover;

      /*
       * Very slight breathing of the whole glass.
       */
      const scale =
        1 +
        Math.sin(elapsed * 0.7) *
        0.002 +
        this.hover *
        0.006;

      this.group.scale.set(scale, scale, 1);

      this.renderer.render(this.scene, this.camera);
    }

    resize() {
      this.width = this.element.clientWidth;
      this.height = this.element.clientHeight;

      this.camera.left = -this.width / 2;
      this.camera.right = this.width / 2;
      this.camera.top = this.height / 2;
      this.camera.bottom = -this.height / 2;

      this.camera.updateProjectionMatrix();
      this.renderer.setSize(this.width, this.height, false);
    }
  }
