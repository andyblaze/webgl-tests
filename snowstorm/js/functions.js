export function mt_randf(min, max) {
    return min + Math.random() * (max - min);
}

export function mt_rand(min, max) {
    return Math.floor(mt_randf(min, max + 1));
}
export function createOptions(px, py, r, pvx, pvy) {
    return {
        radius: r,
        x: px,
        y: py,
        vx: pvx,
        vy: pvy
    };
}

export function drawGl(gl, t) {
    t *= 0.001;
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.uniform2f(uResolution, glCanvas.width, glCanvas.height);
    gl.uniform1f(uTime, t);
    gl.uniform1f(uOpacity, glConfig.opacity);
    gl.uniform1f(uCloudHeight, glConfig.cloudHeight);
    gl.uniform1f(uNoiseScale, glConfig.noiseScale);
    gl.uniform2f(uDrift, glConfig.driftSpeedX, glConfig.driftSpeedY);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}
