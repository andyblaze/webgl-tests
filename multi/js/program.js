export default class Program {
    constructor(gl) {
        this.gl = gl;
        this.feedback = null;
        this.copy = null;
    }
    compile(type, src){
        const s = this.gl.createShader(type);
        this.gl.shaderSource(s, src);
        this.gl.compileShader(s);
        return s;
    }
    make(type, fsSource, vs){
        const p = this.gl.createProgram();
        this.gl.attachShader(p, this.compile(this.gl.VERTEX_SHADER, vs));
        this.gl.attachShader(p, this.compile(this.gl.FRAGMENT_SHADER, fsSource));
        this.gl.linkProgram(p);
        this[type] = p;
    }
}
