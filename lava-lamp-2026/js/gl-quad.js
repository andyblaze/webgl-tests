export default class GlQuad {
    constructor(gl) {
        this.gl = gl;
        this.quad = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.quad);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        -1,-1, 1,-1, -1, 1,
        -1, 1, 1,-1, 1, 1
        ]), gl.STATIC_DRAW);
    }
    bindTo(program){
        const pos = this.gl.getAttribLocation(program,"position");
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.quad);
        this.gl.enableVertexAttribArray(pos);
        this.gl.vertexAttribPointer(pos, 2, this.gl.FLOAT, false, 0, 0);
    }
}
