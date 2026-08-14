  import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.179.1/build/three.module.js";
  import { configs } from "./config.js";
  import Snowglobe from "./snowglobe.js";

  /*
   * Snowglobe buttons
   *
   * Each button owns a tiny Three.js scene.
   *
   * The particles aren't animated by simply assigning random positions.
   * They have velocity, damping, and small stochastic impulses, producing
   * a slow Brownian-ish drift.
   */



  const buttons = [];

  /*
   * Create one Three.js scene per button.
   */
  document.querySelectorAll(".snowglobe")
    .forEach(element => {
      buttons.push(
        new Snowglobe(THREE, element, configs)
      );
    });

  /*
   * Resize handling.
   */
  const resizeObserver =
    new ResizeObserver(() => {
      buttons.forEach(button =>
        button.resize()
      );
    });

  buttons.forEach(button =>
    resizeObserver.observe(button.element)
  );

  /*
   * Animation loop.
   */
  const clock = new THREE.Clock();

  let elapsed = 0;

  function animate() {
    requestAnimationFrame(animate);

    const dt = Math.min(clock.getDelta(), 0.033);
    elapsed += dt;

    buttons.forEach(button =>
      button.update(dt, elapsed)
    );
  }

  animate();