precision highp float;

uniform sampler2D previousFrame;
uniform vec2 resolution;
uniform float time;

uniform float fade;
uniform float rotationSpeed;
uniform float zoom;

uniform float waveAmount;
uniform float waveScaleX;
uniform float waveScaleY;

uniform float warpStrength;
uniform float warpScale;
uniform float warpSpeed;
uniform float warpDetail;
uniform float warpAngularBias;
uniform float warpRadialBias;

uniform float glowStrength;
uniform float glowRadius;
uniform float glowPulse;

uniform float sparkThreshold;
uniform float sparkBrightness;

uniform float hueSpeed;
uniform float saturation;
uniform float brightness;

varying vec2 vUv;

mat2 rot(float a) {
    float s = sin(a);
    float c = cos(a);
    return mat2(c,-s,s,c);
}

float hash(vec2 p) {
    return fract(sin(dot(p,vec2(127.1,311.7))) * 43758.5453);
}

float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    float a = hash(i);
    float b = hash(i+vec2(1.0, 0.0));
    float c = hash(i+vec2(0.0, 1.0));
    float d = hash(i+vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) +
           (c - a) * u.y * (1.0 - u.x) +
           (d - b) * u.x * u.y;
}

vec3 hsv2rgb(vec3 c) {
    vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
    rgb = rgb * rgb * (3.0 - 2.0 * rgb);
    return c.z * mix(vec3(1.0), rgb, c.y);
}

//////////////////////////////////////////////////////
// MAIN
//////////////////////////////////////////////////////

void main(){

    vec2 uv = vUv;
    vec2 p = uv - 0.5;

    p.x *= resolution.x / resolution.y;

    //////////////////////////////////////////////////
    // BASE MOTION
    //////////////////////////////////////////////////

    p *= rot(rotationSpeed);
    p *= zoom;

    //////////////////////////////////////////////////
    // 🌊 ORIGINAL WAVES
    //////////////////////////////////////////////////

    p.x += sin(p.y * waveScaleX + time) * waveAmount;
    p.y += cos(p.x * waveScaleY - time * 0.7) * waveAmount;

    //////////////////////////////////////////////////
    // 🌪️ WARP FIELD (NEW CORE FEATURE)
    //////////////////////////////////////////////////

    float t = time * warpSpeed;

    float ang = atan(p.y, p.x);
    float r = length(p);

    float n1 = noise(vec2(ang * warpScale, t));
    float n2 = noise(vec2(r * warpScale, t * 0.7));

    float angularWarp =
        (n1 - 0.5) *
        warpStrength *
        warpAngularBias;

    float radialWarp =
        (n2 - 0.5) *
        warpStrength *
        warpRadialBias;

    ang += angularWarp;
    r += radialWarp;

    p = vec2(cos(ang), sin(ang)) * r;

    //////////////////////////////////////////////////
    // BACK TO UV
    //////////////////////////////////////////////////

    vec2 sampleUV = p;
    sampleUV.x /= resolution.x / resolution.y;
    sampleUV += 0.5;

    vec3 prev = texture2D(previousFrame, sampleUV).rgb;

    prev *= fade;

    //////////////////////////////////////////////////
    // GLOW RINGS
    //////////////////////////////////////////////////

    float cx = noise(vec2(time * 0.05, 1.3));
    float cy = noise(vec2(time * 0.05, 8.7));

    vec2 centre = vec2(cx, cy);
    centre = (centre - 0.5) * 0.3;
    vec2 q = uv - 0.5 - centre;

    q.x *= resolution.x / resolution.y;

    float rr = length(q);
    rr += noise(q * 4.0 + time * 0.1) * 0.13;

    float glow = 0.0;

    for( int i=0; i<6; i++) {
        float fi = float(i);
        glow += glowStrength /
            abs(rr - (glowRadius + sin(fi * 1.7 + time * 0.4) * glowPulse));
    }

    //////////////////////////////////////////////////
    // COLOR CYCLING
    //////////////////////////////////////////////////

    float hue = mod(time * hueSpeed + rr * 0.3, 1.0);

    vec3 baseColor = hsv2rgb(vec3(hue, saturation, brightness));

    vec3 col = prev;
    col += baseColor * glow;

    //////////////////////////////////////////////////
    // SPARKS
    //////////////////////////////////////////////////

    float n = hash(floor(uv * resolution.xy * 0.4) + floor(time * 20.0));

    if( n > sparkThreshold ) {

        vec3 sparkColor =
            hsv2rgb(vec3(mod(hue + 0.15, 1.0), 1.0, 1.5));

        col += sparkColor * sparkBrightness;
    }

    gl_FragColor = vec4(col,1.0);
}