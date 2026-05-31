export default class Config {

    constructor() {

        // physics
        this.gravity = 0.31;
        this.airDrag = 0.0251;
        this.groundFriction = 0.972;
        // horizontal wind
        // negative = left
        // positive = right
        this.windSpeed = -0.025;
        this.baseWindSpeed = 0.00025;

        // spawning
        this.spawnRate = 60;         // particles per frame
        this.maxParticles = 400;

        // hail sizes
        this.minRadius = 1;
        this.maxRadius = 6;

        this.minMassAdjuster = 0.05;
        this.maxMassAdjuster = 0.25;

        // velocity
        this.minFallSpeed = 2;
        this.maxFallSpeed = 6;

        // bounce
        this.bounceLoss = 0.00965;

        // fragmentation
        this.breakVelocity = 20;
        this.minBreakRadius = 10;
        this.fragmentCountMin = 3;
        this.fragmentCountMax = 5;

        // settling
        this.sleepThreshold = 0.95;

        // rendering
        this.backgroundFade = 1;
        this.particleBrightness = 220;

        // aging / cleanup
        this.enableAging = true;
        this.sleepFadeStart = 120;
        this.sleepFadeEnd = 240;
        this.radiusShrinkRate = 0.985;
        this.alphaFadeRate = 0.99;

        // canvas stuff
        this.canvas = null;
        this.ctx = null;
        this.canvasW = 0;
        this.canvasH = 0;
    }
    initCanvas(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext("2d");
    }
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;   
        this.canvasW = this.canvas.width;
        this.canvasH = this.canvas.height;     
    }
}
