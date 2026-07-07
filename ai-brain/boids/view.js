export default class View {
    constructor(id, config) {
        this.onscreen = document.getElementById(id);
        this.onCtx = this.onscreen.getContext("2d");
        this.offscreen = document.createElement("canvas");
        this.offCtx = this.offscreen.getContext("2d");
        this.skyImage = new Image();
        this.skyImage.src = "sky.jpg";
        this.cfg = config;
    }
    resize(w, h) {
        this.onscreen.width = w;
        this.onscreen.height = h;
        this.offscreen.width = w;
        this.offscreen.height = h;
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
        this.offCtx.drawImage(this.skyImage, 0, 0, this.offscreen.width, this.offscreen.height);
        this.drawSkyOverlay();
        this.offCtx.fillStyle = "rgba(0,0,0,0.7)";
        boids.forEach(boid => {

            this.offCtx.save();
            
            const { x, y } = boid.position;
            const angle = Math.atan2(boid.velocity.y, boid.velocity.x);
            this.offCtx.translate(x, y);
            this.offCtx.rotate(angle);
            
            const scale = 3.8; // more = bigger boid on screen
            this.offCtx.globalAlpha = boid.opacity;
            this.drawBoid(scale);
            
            this.offCtx.restore();
        });
        this.overlayFog(400);
        this.blit();
    }
    blit() {
        this.onCtx.clearRect(0, 0, this.onscreen.width, this.onscreen.height);
        this.onCtx.drawImage(this.offscreen, 0, 0);  
    }
}