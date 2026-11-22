export default class PerformanceMonitor {
    constructor(renderer, sampleSize = 300) {
        this.renderer = renderer;
        this.sampleSize = sampleSize;
        this.frames = [];
        this.lastFrame = 0;
        this.lastDelta = 0;
        this.logInterval = 2000;
        this.lastLog = 0;
        this.active = true;
        this.observer = null;

        this.stats = {
            fps: 0,
            averageFPS: 0,
            lowFPS: 0,
            frameTime: 0,
            p99: 0,
            drawCalls: 0,
            triangles: 0
        };
    }
    setActive(a) {
        this.active = a;
    }
    getStats() {
        const sorted = [...this.frames].sort(
            (a, b) => a - b
        );

        const count = sorted.length;

        const average = sorted.reduce((a, b) => a + b, 0) / count;

        // Slowest 1% of frames
        const slowFrames = sorted.slice(
            Math.floor(count * 0.99)
        );
        const lowAverage = slowFrames.length
        ? slowFrames.reduce((a, b) => a + b, 0) / slowFrames.length
        : average;

        return {
            fps: 1000 / this.lastDelta,
            averageFPS: 1000 / average,
            lowFPS: 1000 / lowAverage,
            frameTime: this.lastDelta,
            p99: sorted[Math.floor(count * 0.99)],
            drawCalls: this.renderer.info.render.calls,
            triangles: this.renderer.info.render.triangles
        };    
    }
    toConsole() {
        console.log(
            `[Performance] FPS: ${this.stats.fps.toFixed(1)} | ` +
            `Average: ${this.stats.averageFPS.toFixed(1)} | ` +
            `1% Low: ${this.stats.lowFPS.toFixed(1)} | ` +
            `Frame: ${this.stats.frameTime.toFixed(2)}ms | ` +
            `Draw calls: ${this.stats.drawCalls} | ` +
            `Triangles: ${this.stats.triangles}`
        );
    }
    addObserver(o) {
        this.observer = o;
    }
    notify() {
        if ( null === this.observer )
            this.toConsole();
        else 
            this.observer.update(this.stats);
    }
    update(timestamp) {
        if (false === this.active) return;

        if ( this.lastFrame !== 0 ) {
            const delta = timestamp - this.lastFrame;

            // Ignore background-tab pauses
            if ( delta > 0 && delta < 1000 ) {
                this.frames.push(delta);

                if ( this.frames.length > this.sampleSize ) {
                    this.frames.shift();
                }
                this.lastDelta = delta;
            }
        }
        this.lastFrame = timestamp;

        if ( timestamp - this.lastLog >= this.logInterval ) {
            if ( this.frames.length > 0 ) {
                this.stats = this.getStats();
                this.notify();
            }
            this.lastLog = timestamp;
        }
    }
}
