export default class Renderer {
    constructor(gl, cfg, opts) {
        this.gl = gl;
        this.cfg = cfg;
        this.buffers = opts.buffers;
        this.canvas = opts.canvas;
        this.quad = opts.quad;
        this.feedbackProgram = opts.feedbackProgram;
        this.copyProgram = opts.copyProgram;
        this.uniforms = {};
        for( const key in this.cfg ) {
            this.uniforms[key] =
                gl.getUniformLocation(this.feedbackProgram, key);
        }
    }
    draw(t) {
        const time = t * 0.001;
        const gl = this.gl;
        const buffers = this.buffers;
        const feedbackProgram = this.feedbackProgram;
        const copyProgram = this.copyProgram;

        gl.bindFramebuffer(gl.FRAMEBUFFER, buffers.backFbo);
        gl.useProgram(feedbackProgram);
        this.quad.bindTo(feedbackProgram);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, buffers.frontTex);

        gl.uniform1i(gl.getUniformLocation(feedbackProgram, "previousFrame"), 0);
        gl.uniform2f(gl.getUniformLocation(feedbackProgram, "resolution"), this.canvas.width, this.canvas.height);
        gl.uniform1f(gl.getUniformLocation(feedbackProgram, "time"), time);

        for ( const key in this.cfg ) {
            const loc = this.uniforms[key];
            if ( null !== loc ) {
                gl.uniform1f(loc, this.cfg[key]);
            }
        }

        gl.drawArrays(gl.TRIANGLES, 0, 6);

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.useProgram(copyProgram);
        this.quad.bindTo(copyProgram); 

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, buffers.backTex);
        gl.uniform1i(gl.getUniformLocation(copyProgram, "tex"), 0);

        gl.drawArrays(gl.TRIANGLES, 0, 6);

        buffers.swap();        
    }
}
