import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180/build/three.module.js";

import config from "./config.js";
import Controller from "./controller.js";
import Model from "./model.js";
import View from "./three-view.js";

window.addEventListener("DOMContentLoaded", () => {
    const controller = new Controller(
        THREE,
        new Model(config), 
        new View(THREE, "onscreen", config), 
        config
    );
    window.addEventListener("resize", controller.resize.bind(controller));
    window.addEventListener("click", function() {controller.paused = ! controller.paused;});
    controller.resize();
    controller.loop();
});
