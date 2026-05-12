precision highp float;

uniform sampler2D previousFrame;
uniform vec2 resolution;
uniform float time;

//////////////////////////////////////////////////////
// CONFIG
//////////////////////////////////////////////////////

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

//////////////////////////////////////////////////////
// WORLD CONFIG
//////////////////////////////////////////////////////

uniform float horizonY;
uniform float flowSpeed;

uniform float skyDetail;
uniform float groundDetail;

uniform float mistStrength;
uniform float horizonGlow;

varying vec2 vUv;

//////////////////////////////////////////////////////
// HASH
//////////////////////////////////////////////////////

float hash(vec2 p){

    return fract(
        sin(dot(p,vec2(127.1,311.7)))
        * 43758.5453123
    );
}

//////////////////////////////////////////////////////
// NOISE
//////////////////////////////////////////////////////

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
    // FEEDBACK SPACE
    //////////////////////////////////////////////////

    vec2 p = uv - 0.5;

    p.x *=
        resolution.x /
        resolution.y;

    //////////////////////////////////////////////////
    // FEEDBACK DRIFT
    //////////////////////////////////////////////////

    float driftA =
        fbm(
            p * 2.0 +
            time * 0.05
        );

    float driftB =
        fbm(
            p * 3.0 -
            time * 0.04
        );

    p.x +=
        (driftA - 0.5)
        * waveAmount
        * 5.0;

    p.y +=
        (driftB - 0.5)
        * waveAmount
        * 5.0;

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
    // HORIZON WORLD
    //////////////////////////////////////////////////

    float horizon =
        horizonY;

    vec2 world = uv;

    world.x -= 0.5;
    world.y -= horizon;

    world.x *=
        resolution.x /
        resolution.y;

    //////////////////////////////////////////////////
    // MASKS
    //////////////////////////////////////////////////

    float skyMask =
        smoothstep(
            -0.01,
             0.03,
             uv.y - horizon
        );

    float groundMask =
        1.0 - skyMask;

    //////////////////////////////////////////////////
    // SKY FLOW
    // (+y sample motion = visual DOWN)
    //////////////////////////////////////////////////

    vec2 skyP = world;

    skyP.y +=
        time * flowSpeed;

    skyP.x +=
        sin(
            skyP.y * 2.0 +
            time * 0.2
        ) * 0.12;

    skyP.x +=
        (fbm(
            skyP * 2.0 +
            time * 0.04
        ) - 0.5) * 0.2;

    float skyNoise =
        fbm(
            skyP *
            skyDetail
        );

    float skyBands =
        sin(
            skyNoise * 7.0 +
            skyP.y * 5.0
        );

    skyBands =
        pow(
            abs(skyBands),
            6.0
        );

    //////////////////////////////////////////////////
    // GROUND FLOW
    // (-y sample motion = visual UP)
    //////////////////////////////////////////////////

    vec2 groundP = world;

    groundP.y -=
        time * flowSpeed;

    groundP.x +=
        sin(
            groundP.y * 5.0 -
            time * 0.15
        ) * 0.08;

    groundP.x +=
        (fbm(
            groundP * 3.0 -
            time * 0.05
        ) - 0.5) * 0.1;

    float groundNoise =
        fbm(
            groundP *
            groundDetail
        );

    float groundBands =
        sin(
            groundNoise * 11.0 -
            groundP.y * 12.0
        );

    groundBands =
        pow(
            abs(groundBands),
            9.0
        );

    //////////////////////////////////////////////////
    // HORIZON MIST
    //////////////////////////////////////////////////

    float mist =
        fbm(
            world * 2.0 +
            time * 0.03
        );

    //////////////////////////////////////////////////
    // HORIZON LIGHT
    //////////////////////////////////////////////////

    float horizonDist =
        abs(uv.y - horizon);

    float horizonLight =
        horizonGlow /
        (horizonDist + 0.025);

    //////////////////////////////////////////////////
    // COLOR
    //////////////////////////////////////////////////

    float hue =
        mod(
            time * hueSpeed +
            mist * 0.15 +
            uv.y * 0.08,
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
        skyBands *
        skyMask *
        0.45;

    col +=
        baseColor *
        groundBands *
        groundMask *
        0.5;

    col +=
        baseColor *
        mist *
        mistStrength *
        0.18;

    col +=
        baseColor *
        horizonLight *
        0.35;

    //////////////////////////////////////////////////
    // SPORES
    //////////////////////////////////////////////////

    float spore =
        hash(
            floor(
                uv *
                resolution.xy *
                0.5
            ) +
            floor(time * 10.0)
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
    // VIGNETTE
    //////////////////////////////////////////////////

    float vignette =
        smoothstep(
            1.7,
            0.05,
            length(uv - 0.5)
        );

    col *= vignette;

    //////////////////////////////////////////////////
    // FINAL
    //////////////////////////////////////////////////

    gl_FragColor =
        vec4(col,1.0);
}