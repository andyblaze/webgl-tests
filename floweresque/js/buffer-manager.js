export default class BufferManager {
    constructor(gl) {
        this.gl = gl;
        this.frontTex = null;
        this.backTex = null;
        this.frontFbo = null;
        this.backFbo = null;
    }
    createTexture(width, height) {
        const gl = this.gl;
        const tex = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        return tex;
    }
    createFbo(tex) {
        const gl = this.gl;
        const fbo = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
        return fbo;
    }
    create(width, height) {
        this.frontTex = this.createTexture(width, height);
        this.backTex = this.createTexture(width, height);
        this.frontFbo = this.createFbo(this.frontTex);
        this.backFbo = this.createFbo(this.backTex);
    }
    swap() {
        [this.frontTex, this.backTex] = [this.backTex, this.frontTex];
        [this.frontFbo, this.backFbo] = [this.backFbo, this.frontFbo];
    }
}
