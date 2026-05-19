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

uniform float foldStrength;
uniform float foldFrequency;

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
    vec2 i=floor(p);
    vec2 f=fract(p);

    float a=hash(i);
    float b=hash(i+vec2(1.0,0.0));
    float c=hash(i+vec2(0.0,1.0));
    float d=hash(i+vec2(1.0,1.0));

    vec2 u=f*f*(3.0-2.0*f);

    return mix(a,b,u.x)
         + (c-a)*u.y*(1.0-u.x)
         + (d-b)*u.x*u.y;
}

vec3 hsv2rgb(vec3 c){
    vec3 rgb =
        clamp(
            abs(mod(c.x*6.0 + vec3(0.0,4.0,2.0),6.0)-3.0)-1.0,
            0.0,1.0
        );

    rgb = rgb*rgb*(3.0-2.0*rgb);
    return c.z * mix(vec3(1.0), rgb, c.y);
}

//////////////////////////////////////////////////////
// STRESS FIELD (CORE NEW SYSTEM)
//////////////////////////////////////////////////////

float stress(vec2 p, float t){
    float n1 = noise(p * 2.0 + t);
    float n2 = noise(p * 4.0 - t * 1.3);

    float s = abs(n1 - n2);

    // sharpen into “fracture zones”
    return pow(s, 2.2);
}

void main(){

    vec2 uv = vUv;
    vec2 p = uv - 0.5;
    p.x *= resolution.x / resolution.y;

    p *= rot(rotationSpeed);
    p *= zoom;

    float t = time * warpSpeed;

    //////////////////////////////////////////////////
    // BASE WAVING FIELD
    //////////////////////////////////////////////////

    float w1 = noise(p * waveScaleX + t);
    float w2 = noise(p * waveScaleY - t);

    p += vec2(w1 - 0.5, w2 - 0.5) * waveAmount;

    //////////////////////////////////////////////////
    // STRESS DISTORTION (KEY CHANGE)
    //////////////////////////////////////////////////

    float s = stress(p, t);

    // stress causes local “bend collapse”
    float ang = atan(p.y, p.x);
    float r = length(p);

    ang += (s - 0.2) * warpStrength * 2.5;
    r   -= s * warpStrength * 0.8;

    // sudden micro folding instability
    ang += sin(r * 10.0 + t * 3.0) * s * 0.6;

    p = vec2(cos(ang), sin(ang)) * r;

    //////////////////////////////////////////////////
    // FEEDBACK
    //////////////////////////////////////////////////

    vec2 sampleUV = p;
    sampleUV.x /= resolution.x / resolution.y;
    sampleUV += 0.5;

    vec3 prev = texture2D(previousFrame, sampleUV).rgb * fade;

    //////////////////////////////////////////////////
    // ENERGY INTERFERENCE
    //////////////////////////////////////////////////

    float rr = length(p);

    float bands =
        sin(rr * 18.0 - time * 2.5)
      + cos(ang * 8.0 + time);

    float energy = abs(bands) * (1.0 + s * 6.0);

    //////////////////////////////////////////////////
    // GLOW = STRESS DISCHARGE
    //////////////////////////////////////////////////

    float glow =
        glowStrength *
        energy /
        (0.01 + abs(rr - glowRadius));

    //////////////////////////////////////////////////
    // COLOUR = FRACTURE HEATMAP
    //////////////////////////////////////////////////

    float hue =
        mod(
            time * hueSpeed +
            s * 0.8 +
            rr * 0.2,
            1.0
        );

    vec3 col = prev;

    vec3 base = hsv2rgb(vec3(hue, saturation, brightness));

    col += base * glow * 25.0;

    //////////////////////////////////////////////////
    // SPARK EVENTS (STRESS BREAKS)
    //////////////////////////////////////////////////

    float n = hash(floor(uv * resolution.xy * 0.5) + floor(time * 22.0));

    if(n > sparkThreshold && s > 0.35){
        col += vec3(1.0,0.9,0.6) * sparkBrightness * 1.8;
    }

    gl_FragColor = vec4(col,1.0);
}