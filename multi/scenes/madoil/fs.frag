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
uniform float warpAngularBias;
uniform float warpRadialBias;

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

//////////////////////////////////////////////////////
// UTILS
//////////////////////////////////////////////////////

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
    float b = hash(i + vec2(1.0,0.0));
    float c = hash(i + vec2(0.0,1.0));
    float d = hash(i + vec2(1.0,1.0));

    vec2 u = f*f*(3.0-2.0*f);

    return mix(a,b,u.x)
         + (c-a)*u.y*(1.0-u.x)
         + (d-b)*u.x*u.y;
}

vec3 hsv2rgb(vec3 c){

    vec3 rgb =
        clamp(
            abs(mod(c.x*6.0 + vec3(0.0,4.0,2.0),6.0)-3.0)-1.0,
            0.0,
            1.0
        );

    rgb = rgb*rgb*(3.0-2.0*rgb);

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
    // FEEDBACK MOTION
    //////////////////////////////////////////////////

    p *= rot(rotationSpeed);
    p *= zoom;

    //////////////////////////////////////////////////
    // DIRECTIONAL SWEEP FIELD
    //////////////////////////////////////////////////

    float t = time * warpSpeed;

    float ang = atan(p.y,p.x);
    float r = length(p);

    float sweep =
        sin(
            ang * foldFrequency
            - time * 1.8
        );

    float directional =
        noise(
            vec2(
                ang * warpScale * 8.0,
                r * 2.0 - t
            )
        );

    //////////////////////////////////////////////////
    // VECTOR PULL
    //////////////////////////////////////////////////

    ang +=
        sweep *
        directional *
        warpStrength *
        warpAngularBias;

    r +=
        sin(
            directional * 8.0 +
            time
        ) *
        warpRadialBias *
        0.2;

    //////////////////////////////////////////////////
    // REBUILD
    //////////////////////////////////////////////////

    p = vec2(cos(ang), sin(ang)) * r;

    //////////////////////////////////////////////////
    // SIGNAL DRIFT
    //////////////////////////////////////////////////

    p.x +=
        sin(p.y * waveScaleX + time)
        * waveAmount;

    p.y +=
        cos(p.x * waveScaleY - time*0.4)
        * waveAmount;

    //////////////////////////////////////////////////
    // FEEDBACK
    //////////////////////////////////////////////////

    vec2 sampleUV = p;

    sampleUV.x /=
        resolution.x /
        resolution.y;

    sampleUV += 0.5;

    vec3 prev =
        texture2D(
            previousFrame,
            sampleUV
        ).rgb;

    prev *= fade;

    //////////////////////////////////////////////////
    // SENSOR ARCS
    //////////////////////////////////////////////////

    float arcs =
        abs(
            sin(
                ang * foldFrequency +
                r * 20.0 -
                time * 3.0
            )
        );

    arcs = pow(arcs, 18.0);

    //////////////////////////////////////////////////
    // SWEEP ENERGY
    //////////////////////////////////////////////////

    float sweepGlow =
        abs(
            sin(
                r * 30.0 -
                time * 5.0 +
                directional * 5.0
            )
        );

    sweepGlow = pow(sweepGlow, 10.0);

    //////////////////////////////////////////////////
    // COLOUR
    //////////////////////////////////////////////////

    float hue =
        mod(
            time * hueSpeed +
            directional * 0.4 +
            arcs * 0.2,
            1.0
        );

    vec3 baseColor =
        hsv2rgb(
            vec3(
                hue,
                saturation,
                brightness
            )
        );

    //////////////////////////////////////////////////
    // COMBINE
    //////////////////////////////////////////////////

    vec3 col = prev;

    col +=
        baseColor *
        arcs *
        glowStrength *
        18.0;

    col +=
        baseColor *
        sweepGlow *
        0.08;

    //////////////////////////////////////////////////
    // HUNTER FLASH EVENTS
    //////////////////////////////////////////////////

    float n =
        hash(
            floor(
                uv *
                resolution.xy *
                0.3
            ) +

            floor(time * 24.0)
        );

    if(
        n > sparkThreshold &&
        arcs > 0.7
    ){

        vec3 flash =
            hsv2rgb(
                vec3(
                    mod(hue + 0.5,1.0),
                    1.0,
                    2.0
                )
            );

        col +=
            flash *
            sparkBrightness;
    }

    //////////////////////////////////////////////////
    // FINAL
    //////////////////////////////////////////////////

    gl_FragColor =
        vec4(col,1.0);
}