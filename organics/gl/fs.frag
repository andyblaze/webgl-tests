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

//////////////////////////////////////////////////////
// ROTATION
//////////////////////////////////////////////////////

mat2 rot(float a){

    float s = sin(a);
    float c = cos(a);

    return mat2(
         c,-s,
         s, c
    );
}

//////////////////////////////////////////////////////
// HASH / NOISE
//////////////////////////////////////////////////////

float hash(vec2 p){

    return fract(
        sin(dot(p,vec2(127.1,311.7)))
        * 43758.5453123
    );
}

float noise(vec2 p){

    vec2 i = floor(p);
    vec2 f = fract(p);

    float a = hash(i);
    float b = hash(i + vec2(1.0,0.0));
    float c = hash(i + vec2(0.0,1.0));
    float d = hash(i + vec2(1.0,1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return
        mix(a,b,u.x)
        + (c-a) * u.y * (1.0-u.x)
        + (d-b) * u.x * u.y;
}

//////////////////////////////////////////////////////
// FBM
//////////////////////////////////////////////////////

float fbm(vec2 p){

    float v = 0.0;

    v += noise(p * 1.0) * 0.5;
    v += noise(p * 2.0) * 0.25;
    v += noise(p * 4.0) * 0.125;
    v += noise(p * 8.0) * 0.0625;

    return v;
}

//////////////////////////////////////////////////////
// HSV
//////////////////////////////////////////////////////

vec3 hsv2rgb(vec3 c){

    vec3 rgb =
        clamp(
            abs(
                mod(
                    c.x * 6.0 +
                    vec3(0.0,4.0,2.0),
                    6.0
                ) - 3.0
            ) - 1.0,
            0.0,
            1.0
        );

    rgb = rgb * rgb * (3.0 - 2.0 * rgb);

    return c.z * mix(vec3(1.0), rgb, c.y);
}

//////////////////////////////////////////////////////
// MAIN
//////////////////////////////////////////////////////

void main(){

    vec2 uv = vUv;

    //////////////////////////////////////////////////
    // CENTERED SPACE
    //////////////////////////////////////////////////

    vec2 p = uv - 0.5;

    p.x *=
        resolution.x /
        resolution.y;

    //////////////////////////////////////////////////
    // FEEDBACK MOTION
    //////////////////////////////////////////////////

    p *= rot(rotationSpeed);

    p *= zoom;

    //////////////////////////////////////////////////
    // SOFT FLUID DRIFT
    //////////////////////////////////////////////////

    float flow1 =
        fbm(
            p * 2.5 +
            time * 0.08
        );

    float flow2 =
        fbm(
            p * 3.5 -
            time * 0.06
        );

    p.x +=
        (flow1 - 0.5)
        * waveAmount
        * 4.0;

    p.y +=
        (flow2 - 0.5)
        * waveAmount
        * 4.0;

    //////////////////////////////////////////////////
    // ORGANIC CURL
    //////////////////////////////////////////////////

    float r =
        length(p);

    float ang = atan(p.y,p.x);
    ang = sin(ang);

    ang +=
        sin(
            r * 7.0 -
            time * 0.7
        ) * 0.25;

    ang +=
        (fbm(
            vec2(
                ang * 2.0,
                r * 5.0 +
                time * 0.2
            )
        ) - 0.5)
        * warpStrength
        * 2.0;

    r +=
        sin(
            ang * 5.0 +
            time
        ) * 0.03;

    //////////////////////////////////////////////////
    // REBUILD SPACE
    //////////////////////////////////////////////////

    p =
        vec2(
            cos(ang),
            sin(ang)
        ) * r;

    //////////////////////////////////////////////////
    // SAMPLE UV
    //////////////////////////////////////////////////

    vec2 sampleUV = p;

    sampleUV.x /=
        resolution.x /
        resolution.y;

    sampleUV += 0.5;

    //////////////////////////////////////////////////
    // FEEDBACK
    //////////////////////////////////////////////////

    vec3 prev =
        texture2D(
            previousFrame,
            sampleUV
        ).rgb;

    prev *= fade;

    //////////////////////////////////////////////////
    // LIVING MEMBRANE STRUCTURE
    //////////////////////////////////////////////////

    vec2 q =
        uv - 0.5;

    q.x *=
        resolution.x /
        resolution.y;

    //////////////////////////////////////////////////
    // DRIFTING ORGANIC CENTRE
    //////////////////////////////////////////////////

    vec2 centre =
        vec2(

            fbm(vec2(
                time * 0.05,
                1.7
            )),

            fbm(vec2(
                time * 0.05,
                8.2
            ))

        );

    centre =
        (centre - 0.5)
        * 0.35;

    q -= centre;

    //////////////////////////////////////////////////
    // BIOLOGICAL DISTORTION
    //////////////////////////////////////////////////

    float bio =
        fbm(
            q * 4.0 -
            time * 0.15
        );

    float rr =
        length(q);

    rr +=
        bio * 0.18;

    //////////////////////////////////////////////////
    // CELL WALLS / MEMBRANES
    //////////////////////////////////////////////////

    float membranes = 0.0;

    for(int i=0;i<5;i++){

        float fi = float(i);

        float layer =
            abs(
                sin(
                    rr * (10.0 + fi * 3.0)
                    - time *
                    (0.3 + fi * 0.07)
                )
            );

        layer =
            pow(layer, 18.0);

        membranes += layer;
    }

    //////////////////////////////////////////////////
    // VEIN STRUCTURES
    //////////////////////////////////////////////////

float veins =
    abs(
        sin(
            ang * 9.0 +
            bio * 8.0 +
            noise(q * 3.0) * 2.0 -
            time * 0.5
        )
    );

    veins =
        pow(veins, 25.0);

    //////////////////////////////////////////////////
    // PULSING CORE
    //////////////////////////////////////////////////

    float pulse =
        0.15 /
        abs(
            rr -
            (
                glowRadius +
                sin(time * 0.6)
                * glowPulse
            )
        );

    //////////////////////////////////////////////////
    // COLOR
    //////////////////////////////////////////////////

    float hue =
        mod(
            time * hueSpeed +
            bio * 0.25 +
            rr * 0.15,
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
        membranes *
        glowStrength *
        5.0;

    col +=
        baseColor *
        veins *
        0.7;

    col +=
        baseColor *
        pulse *
        glowStrength *
        3.0;

    //////////////////////////////////////////////////
    // FLOATING SPORES
    //////////////////////////////////////////////////

    float spore =
        hash(
            floor(
                uv *
                resolution.xy *
                0.6
            ) +

            floor(time * 12.0)
        );

    if(spore > sparkThreshold){

        vec3 sporeColor =
            hsv2rgb(
                vec3(
                    mod(hue + 0.08,1.0),
                    0.7,
                    1.8
                )
            );

        col +=
            sporeColor *
            sparkBrightness;
    }

    //////////////////////////////////////////////////
    // SOFT EDGE FADE
    //////////////////////////////////////////////////

    float vignette =
        smoothstep(
            1.3,
            0.15,
            length(uv - 0.5)
        );

    col *= vignette;

    //////////////////////////////////////////////////
    // FINAL
    //////////////////////////////////////////////////

    gl_FragColor =
        vec4(col,1.0);
}