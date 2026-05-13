precision highp float;

uniform vec2 resolution;
uniform float time;

varying vec2 vUv;

//////////////////////////////////////////////////////
// SIMPLE HASH (for subtle texture)
//////////////////////////////////////////////////////

float hash(vec2 p){
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}
float noise(vec2 p){
    vec2 i = floor(p);
    vec2 f = fract(p);

    float a = hash(i);
    float b = hash(i + vec2(1.0,0.0));
    float c = hash(i + vec2(0.0,1.0));
    float d = hash(i + vec2(1.0,1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a,b,u.x) +
           (c-a)*u.y*(1.0-u.x) +
           (d-b)*u.x*u.y;
}
float fbm(vec2 p){

    float v = 0.0;

    v += noise(p * 1.0) * 0.5;
    v += noise(p * 2.0) * 0.25;
    v += noise(p * 4.0) * 0.125;

    return v;
}

//////////////////////////////////////////////////////
// MAIN
//////////////////////////////////////////////////////

void main(){

    vec2 uv = vUv;

    //////////////////////////////////////////////////
    // SCREEN SPACE (-1 to 1)
    //////////////////////////////////////////////////

    vec2 p = uv * 2.0 - 1.0;
    p.x *= resolution.x / resolution.y;

    //////////////////////////////////////////////////
    // CAMERA HEIGHT (STATIC HORIZON LOCK)
    //////////////////////////////////////////////////

    float horizonY = -0.33;

    //////////////////////////////////////////////////
    // FAKE DEPTH AXIS (THIS IS THE CORE)
    //////////////////////////////////////////////////

    float y = p.y - horizonY;

    // prevent division blowup
    float depth = 1.0 / (abs(y) + 0.05);

    //////////////////////////////////////////////////
    // FORWARD MOTION INTO Z
    //////////////////////////////////////////////////

    float camZ = time * 10.5;

    //////////////////////////////////////////////////
    // GROUND PLANE (below horizon)
    //////////////////////////////////////////////////

    float groundMask = step(0.0, y); 

    float groundX = p.x * depth;
    float groundZ = depth + camZ;

    float groundPattern = 
        sin(groundX * 3.0) *
        sin(groundZ * 0.5);

    //////////////////////////////////////////////////
    // SKY PLANE (above horizon)
    //////////////////////////////////////////////////

    float skyMask = 1.0 - groundMask;

float skyWarp =
    fbm(vec2(
        p.x * 1.5,
        depth * 0.615 + camZ * 0.02
    ));

float warpedX =
    p.x +
    (skyWarp - 0.5) * 0.6;

float skyX = warpedX * depth;
    float skyZ = depth + camZ * 0.3;

vec2 cloudUV = vec2(
    skyX * 0.35,
    skyZ * 0.03
);

//////////////////////////////////////////////////////
// DOMAIN WARPING
//////////////////////////////////////////////////////

float warp1 = fbm(cloudUV * 0.7 + vec2(0.0, camZ * 0.01));
float warp2 = fbm(cloudUV * 1.3 - vec2(camZ * 0.015, 0.0));

cloudUV.x += (warp1 - 0.5) * 2.5;
cloudUV.y += (warp2 - 0.5) * 1.5;

//////////////////////////////////////////////////////
// MAIN CLOUD FIELD
//////////////////////////////////////////////////////

float cloudNoise = fbm(cloudUV);

//////////////////////////////////////////////////////
// SHAPE CLOUD MASSES
//////////////////////////////////////////////////////

float skyPattern = smoothstep(
    0.42,
    0.72,
    cloudNoise
);

//////////////////////////////////////////////////////
// DISTANCE FADE
//////////////////////////////////////////////////////

skyPattern *= 1.0 - abs(y) * 0.25;

    //////////////////////////////////////////////////
    // HORIZON GLOW (vanishing singularity)
    //////////////////////////////////////////////////

    float glow = 0.03 / (abs(y) + 0.03);

    //////////////////////////////////////////////////
    // COLOR BASES
    //////////////////////////////////////////////////

    vec3 groundCol = vec3(0.1, 0.2, 0.4);
    vec3 skyCol = vec3(0.1, 0.3, 0.1);
    vec3 glowCol = vec3(0.6, 0.7, 1.0);

    //////////////////////////////////////////////////
    // COMBINE
    //////////////////////////////////////////////////

    vec3 col = vec3(0.0);

    col += skyCol * skyPattern * skyMask;
    col += groundCol * groundPattern * groundMask;
    col += glowCol * glow * 0.5;

    //////////////////////////////////////////////////
    // SIMPLE VIGNETTE (FOCUS MOTION)
    //////////////////////////////////////////////////

    float vignette = 1.0 - dot(p, p) * 0.5;
    col *= vignette;

    gl_FragColor = vec4(col, 1.0);
}