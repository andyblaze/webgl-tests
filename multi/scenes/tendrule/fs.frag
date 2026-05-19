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

uniform float foldStrength;
uniform float foldFrequency;
uniform float seamWidth;

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
    return mix(a,b,u.x) +
           (c-a)*u.y*(1.0-u.x) +
           (d-b)*u.x*u.y;
}

vec3 hsv2rgb(vec3 c){
    vec3 rgb = clamp(abs(mod(c.x*6.0 + vec3(0.0,4.0,2.0),6.0)-3.0)-1.0,0.0,1.0);
    rgb = rgb*rgb*(3.0-2.0*rgb);
    return c.z * mix(vec3(1.0), rgb, c.y);
}

vec2 fold(vec2 p){
    float a = atan(p.y,p.x);
    float r = length(p);

    float sectors = foldFrequency;
    float k = 6.283185 / sectors;

    a = mod(a, k);
    a = abs(a - k*0.5);

    r = r + sin(r*10.0 + time*0.7) * foldStrength;

    return vec2(cos(a), sin(a)) * r;
}

void main(){

    vec2 uv = vUv;
    vec2 p = uv - 0.5;
    p.x *= resolution.x / resolution.y;

    p *= rot(rotationSpeed);
    p *= zoom;

    // drifting interference field
    p.x += sin(p.y * waveScaleX + time) * waveAmount;
    p.y += cos(p.x * waveScaleY - time*0.6) * waveAmount;

    float t = time * warpSpeed;

    float ang = atan(p.y,p.x);
    float r = length(p);

    float n1 = noise(vec2(ang * warpScale, t));
    float n2 = noise(vec2(r * warpScale, t*0.7));

    ang += (n1 - 0.5) * warpStrength * warpAngularBias;
    r   += (n2 - 0.5) * warpStrength * warpRadialBias;

    p = vec2(cos(ang), sin(ang)) * r;

    // collapse folding space
    p = fold(p);

    vec2 sampleUV = p;
    sampleUV.x /= resolution.x / resolution.y;
    sampleUV += 0.5;

    vec3 prev = texture2D(previousFrame, sampleUV).rgb;
    prev *= fade;

    // INTERFERENCE LOBES (NOT RINGS)
    float rr = length(p);

    float bands =
        sin(rr * 14.0 - time * 2.0)
      * cos(atan(p.y,p.x) * 6.0 + time);

    float lobes = pow(abs(bands), 3.0);

    float glow =
        glowStrength /
        (0.01 + abs(rr - glowRadius - lobes * 0.15));

    // SCAR EDGES (SIGNAL BREAKS)
    float seam =
        pow(abs(sin(atan(p.y,p.x) * foldFrequency)), 12.0);

    glow += seam * 0.03;

    // NEON COLOR FIELD (FULL SPECTRUM DRIFT)
    float hue =
        mod(
            time * hueSpeed +
            rr * 0.25 +
            bands * 0.2,
        1.0);

    vec3 baseColor = hsv2rgb(vec3(hue, saturation, brightness));

    vec3 col = prev;
    col += baseColor * glow;

    // SPARK EVENTS (EDGE COLLAPSE)
    float n = hash(floor(uv * resolution.xy * 0.4) + floor(time * 18.0));

    if(n > sparkThreshold){
        vec3 spark =
            hsv2rgb(vec3(mod(hue + 0.2,1.0), 1.0, 1.6));

        col += spark * sparkBrightness;
    }

    gl_FragColor = vec4(col,1.0);
}