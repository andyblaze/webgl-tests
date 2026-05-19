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

mat2 rot(float a){
    float s = sin(a);
    float c = cos(a);
    return mat2(c,-s,s,c);
}

float hash(vec2 p){
    return fract(sin(dot(p,vec2(127.1,311.7))) * 43758.5453);
}

float noise(vec2 p){
    vec2 i = floor(p);
    vec2 f = fract(p);
    float a = hash(i);
    float b = hash(i+vec2(1.0,0.0));
    float c = hash(i+vec2(0.0,1.0));
    float d = hash(i+vec2(1.0,1.0));
    vec2 u = f*f*(3.0-2.0*f);
    return mix(a,b,u.x) + (c-a)*u.y*(1.0-u.x) + (d-b)*u.x*u.y;
}

vec3 hsv2rgb(vec3 c){
    vec3 rgb = clamp(abs(mod(c.x*6.0 + vec3(0.0,4.0,2.0),6.0)-3.0)-1.0,0.0,1.0);
    rgb = rgb*rgb*(3.0-2.0*rgb);
    return c.z * mix(vec3(1.0), rgb, c.y);
}

void main(){

    vec2 uv = vUv;
    vec2 p = uv - 0.5;

float hueField =
    time * hueSpeed
    + p.x * 0.6
    + p.y * 0.4;

    p.x *= resolution.x / resolution.y;

    //////////////////////////////////////////////////
    // MOTION
    //////////////////////////////////////////////////

    p *= rot(rotationSpeed);
    p *= zoom;

    p.x += sin(p.y * waveScaleX + time) * waveAmount;
    p.y += cos(p.x * waveScaleY - time*0.7) * waveAmount;

    //////////////////////////////////////////////////
    // WARP (makes "cells drift like tissue")
    //////////////////////////////////////////////////

    float t = time * warpSpeed;

    float ang = atan(p.y,p.x);
    float r = length(p);

    float n1 = noise(vec2(ang*warpScale, t));
    float n2 = noise(vec2(r*warpScale, t*0.7));

    ang += (n1-0.5) * warpStrength * warpAngularBias;
    r   += (n2-0.5) * warpStrength * warpRadialBias;

    p = vec2(cos(ang), sin(ang)) * r;

    //////////////////////////////////////////////////
    // FEEDBACK
    //////////////////////////////////////////////////



    vec2 sampleUV = p;
    sampleUV.x /= resolution.x / resolution.y;
    sampleUV += 0.5;

    vec3 prev = texture2D(previousFrame, sampleUV).rgb;

    //////////////////////////////////////////////////
    // 🧠 “PREDATION” RESPONSE (key chaos driver)
    //////////////////////////////////////////////////

    float lum = dot(prev, vec3(0.299,0.587,0.114));
    prev *= fade;

    // bright areas slightly suppress neighbors → organic competition
    prev *= (0.92 + 0.08 * smoothstep(0.2, 1.0, lum));

    //////////////////////////////////////////////////
    // ORGANISM FIELD (replaces clean circles)
    //////////////////////////////////////////////////

    float rr = length(p);

    float cell = sin(p.x*10.0 + sin(p.y*6.0 + time))
               * sin(p.y*10.0 + cos(p.x*6.0 - time));

    cell = abs(cell);

    float structure = pow(cell, 3.0);

    //////////////////////////////////////////////////
    // INTERFERENCE GLOW (not rings anymore)
    //////////////////////////////////////////////////

    float glow =
        glowStrength /
        (0.002 + abs(rr - glowRadius - structure*0.25));

    glow *= (0.6 + 0.4*sin(time + rr*10.0));

    //////////////////////////////////////////////////
    // COLOR: NEON BIOLOGY
    //////////////////////////////////////////////////

float h =
    hueField
    + sin(rr * 6.0 + time * 0.5) * 0.2
    + noise(p * 2.0 + time * 0.1) * 0.15;

h = fract(h);

vec3 baseColor = hsv2rgb(vec3(
    h,
    saturation,
    brightness
));

    //////////////////////////////////////////////////
    // FINAL COMPOSITE
    //////////////////////////////////////////////////

    vec3 col = prev;

    col += baseColor * glow * 0.08;

    //////////////////////////////////////////////////
    // SPARK “MUTATIONS”
    //////////////////////////////////////////////////

    float n = hash(floor(uv*resolution.xy*0.4) + floor(time*20.0));

    if(n > sparkThreshold){
        col += vec3(0.4,1.2,1.5) * sparkBrightness;
    }

    gl_FragColor = vec4(col,1.0);
}