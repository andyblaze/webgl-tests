import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180/build/three.module.js";

export default class View {
    constructor(id, config) {
        this.cfg = config;
        this.canvas = document.getElementById(id);
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true
        });
        this.renderer.setClearColor(0x87ceeb);   // sky blue
        this.scene = new THREE.Scene();
        this.camera = new THREE.OrthographicCamera(0, config.width, config.height, 0, -10, 10);
        this.camera.position.z = 1;

        this.boidMesh = new THREE.InstancedMesh(
            new THREE.CircleGeometry(4, 24),
            new THREE.MeshBasicMaterial({
                color: 0x000000,
                side: THREE.DoubleSide,
                transparent: true
            }),
            config.numBoids
        );
        this.scene.add(this.boidMesh);

        this.dummy = new THREE.Object3D();
    }
    resize(w, h) {
        this.renderer.setSize(w, h);
        this.camera.left   = 0;
        this.camera.right  = w;
        this.camera.top    = 0;
        this.camera.bottom = h;
        this.camera.near = -1;
        this.camera.far  = 1;
        this.camera.position.z = 1;
        this.camera.updateProjectionMatrix();
    }
    drawBoid(scale) { 
        this.offCtx.beginPath();
        this.offCtx.moveTo(0, 0);     
        this.offCtx.lineTo(-5 * scale, -2 * scale);  
        this.offCtx.lineTo(-3 * scale, 0);    
        this.offCtx.lineTo(-5 * scale, 2 * scale);    
        this.offCtx.closePath();
        this.offCtx.fill(); 
    }
    overlayFog(height) {
        // --- Layered fog overlay ---
        const gradient = this.offCtx.createLinearGradient(
            0, this.cfg.height - height, 0, this.cfg.height
        );
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
        gradient.addColorStop(1, 'rgba(215, 215, 215, 1)');
        this.offCtx.fillStyle = gradient;
        this.offCtx.fillRect(0, this.cfg.height - height, this.cfg.width, height);
    }
    drawSkyOverlay() {
        // Keep time as a property of the View so it persists across frames
        if (this._overlayTime === undefined) this._overlayTime = 0.11;
        if (this._overlayDirection === undefined) this._overlayDirection = 1;

        this._overlayTime += 0.0005 * this._overlayDirection;
        if (this._overlayTime > 0.3 || this._overlayTime < 0.1) this._overlayDirection *= -1;

        this.offCtx.fillStyle = `rgba(255, 0, 0,${this._overlayTime})`;
        this.offCtx.fillRect(0, 0, this.offscreen.width, this.offscreen.height);
    }
    draw(boids) {
        boids.forEach((boid, i) => {
            this.dummy.position.set(boid.position.x, boid.position.y, 0);
            this.dummy.updateMatrix();
            this.boidMesh.setMatrixAt(i, this.dummy.matrix);

        }); 

        this.boidMesh.instanceMatrix.needsUpdate = true;

        this.renderer.render(this.scene, this.camera);
    }
    blit() {
        this.onCtx.clearRect(0, 0, this.onscreen.width, this.onscreen.height);
        this.onCtx.drawImage(this.offscreen, 0, 0);  
    }
}