export default class Config {

    constructor(canvasId) {

        // physics
        this.gravity = 0.3;
        this.airDrag = 0.025;
        this.groundFriction = 0.972;
        // horizontal wind
        // negative = left
        // positive = right
        this.windSpeed = -0.025;
        this.baseWindSpeed = 0.0025;

        // spawning
        this.spawnRate = 400;         // particles per frame
        this.maxParticles = 2000;

        // hail sizes
        this.minRadius = 1;
        this.maxRadius = 5;

        this.minMassAdjuster = 0.05;
        this.maxMassAdjuster = 0.1;

        // velocity
        this.minFallSpeed = 2;
        this.maxFallSpeed = 5;

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
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext("2d");
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;   
        this.canvasW = this.canvas.width;
        this.canvasH = this.canvas.height; 
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
        glResize(this.canvasW, this.canvasH);   
    }
}
