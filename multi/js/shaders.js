export const vertShader = `
attribute vec2 position;
varying vec2 vUv;

void main(){
    vUv = position * 0.5 + 0.5;
    gl_Position = vec4(position,0.0,1.0);
}
`;

export const fragShaderCopy = `
precision mediump float;
uniform sampler2D tex;
varying vec2 vUv;
void main(){
    gl_FragColor = texture2D(tex,vUv);
}
`;