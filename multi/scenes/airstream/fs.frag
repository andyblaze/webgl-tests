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
    p.x *= resolution.x / resolution.y;

    p *= rot(rotationSpeed);
    p *= zoom;

    //////////////////////////////////////////////////
    // BASE FIELD WAVES
    //////////////////////////////////////////////////

    p.x += sin(p.y * waveScaleX + time) * waveAmount;
    p.y += cos(p.x * waveScaleY - time * 0.7) * waveAmount;

    //////////////////////////////////////////////////
    // ORBITAL ATTRACTION FIELD
    //////////////////////////////////////////////////

    float t = time * warpSpeed;

    float ang = atan(p.y,p.x);
    float r = length(p);

    // drifting “gravity centers”
    vec2 g1 = vec2(
        sin(time*0.3),
        cos(time*0.21)
    ) * 0.35;

    vec2 g2 = vec2(
        cos(time*0.17),
        sin(time*0.27)
    ) * 0.25;

    float d1 = length(p - g1);
    float d2 = length(p - g2);

    float field =
        sin(d1*10.0 - time*2.0) +
        cos(d2*8.0  + time*1.5);

    // convert field into angular/radial bending
    ang += field * warpStrength * warpAngularBias;
    r   += sin(field*2.0) * warpStrength * warpRadialBias;

    p = vec2(cos(ang), sin(ang)) * r;

    //////////////////////////////////////////////////
    // FEEDBACK SAMPLE
    //////////////////////////////////////////////////

    vec2 sampleUV = p;
    sampleUV.x /= resolution.x / resolution.y;
    sampleUV += 0.5;

    vec3 prev = texture2D(previousFrame, sampleUV).rgb;
    prev *= fade;

//////////////////////////////////////////////////
// TECTONIC FIELD
//////////////////////////////////////////////////

float rr = length(p);

float plates =
    sin(
        d1 * 7.0 +
        sin(time * 0.3) * 2.0
    );

plates +=
    cos(
        d2 * 6.0 -
        time * 0.4
    );

plates +=
    sin(
        (p.x + p.y) * 8.0
    );

plates /= 3.0;

float cracks =
    abs(
        sin(
            plates * 18.0
        )
    );

cracks = pow(cracks, 28.0);

float drift =
    abs(
        sin(
            rr * 10.0 -
            time +
            plates * 4.0
        )
    );

drift = pow(drift, 10.0);

float glow =
    (cracks * 1.2 + drift * 0.25)
    *
    glowStrength
    *
    8.0;

//////////////////////////////////////////////////
// COLOR
//////////////////////////////////////////////////

float hue =
    fract(
        0.55 +
        plates * 0.08 +
        rr * 0.04 +
        time * hueSpeed
    );

vec3 baseColor =
    hsv2rgb(
        vec3(
            hue,
            saturation,
            brightness
        )
    );

// hot fault-line cores
baseColor += vec3(cracks * 0.25);

//////////////////////////////////////////////////
// OUTPUT
//////////////////////////////////////////////////

vec3 col = prev;

col +=
    baseColor *
    glow *
    0.16;

    //////////////////////////////////////////////////
    // SPARK EVENTS (orbit collapse points)
    //////////////////////////////////////////////////

    float n =
        hash(floor(uv * resolution.xy * 0.35) + floor(time * 14.0));

    if(n > sparkThreshold){
        col += vec3(0.7,1.1,1.5) * sparkBrightness;
    }

    gl_FragColor = vec4(col,1.0);
}