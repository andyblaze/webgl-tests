precision highp float;

uniform sampler2D previousFrame;
uniform vec2 resolution;
uniform float time;

//////////////////////////////////////////////////////
// CONFIG
//////////////////////////////////////////////////////

uniform float fade;

uniform float waveAmount;

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
        sin(dot(p, vec2(127.1,311.7)))
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
// PERSPECTIVE MAPPING
//////////////////////////////////////////////////////

vec2 projectGround(vec2 p){

    //////////////////////////////////////////////////
    // distance from horizon
    //////////////////////////////////////////////////

    float d =
        max(p.y, 0.02);

    //////////////////////////////////////////////////
    // perspective depth
    //////////////////////////////////////////////////

    float z =
        1.0 / d;

    //////////////////////////////////////////////////
    // move INTO scene
    //////////////////////////////////////////////////

    z +=
        time * flowSpeed;

    //////////////////////////////////////////////////
    // projected coordinates
    //////////////////////////////////////////////////

    vec2 uv;

    uv.x =
        p.x * z * 0.15;

    uv.y =
        z * 0.08;

    //////////////////////////////////////////////////
    // turbulence
    //////////////////////////////////////////////////

    float n =
        fbm(
            vec2(
                uv.x * 2.0,
                uv.y * 0.5
            )
        );

    uv.x +=
        (n - 0.5) * 0.35;

    return uv;
}

//////////////////////////////////////////////////////
// SKY PROJECTION
//////////////////////////////////////////////////////

vec2 projectSky(vec2 p){

    float d =
        max(-p.y, 0.02);

    float z =
        1.0 / d;

    z +=
        time * flowSpeed * 0.6;

    vec2 uv;

    uv.x =
        p.x * z * 0.12;

    uv.y =
        z * 0.05;

    float n =
        fbm(
            vec2(
                uv.x * 1.5,
                uv.y * 0.4
            )
        );

    uv.x +=
        (n - 0.5) * 0.25;

    return uv;
}

//////////////////////////////////////////////////////
// MAIN
//////////////////////////////////////////////////////

void main(){

    vec2 uv = vUv;

    //////////////////////////////////////////////////
    // FEEDBACK
    //////////////////////////////////////////////////

    vec2 fb = uv - 0.5;

    fb.x *=
        resolution.x /
        resolution.y;

    float drift =
        fbm(
            fb * 2.0 +
            time * 0.03
        );

    fb.x +=
        (drift - 0.5)
        * waveAmount;

    vec2 sampleUV = fb;

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
    // WORLD SPACE
    //////////////////////////////////////////////////

    vec2 world = uv;

    world.x -= 0.5;
    world.y -= horizonY;

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
            -world.y
        );

    float groundMask =
        smoothstep(
            0.01,
            0.05,
            world.y
        );

    //////////////////////////////////////////////////
    // SKY
    //////////////////////////////////////////////////

    vec2 skyUV =
        projectSky(world);

    float skyNoise =
        fbm(
            skyUV *
            skyDetail
        );

    float skyBands =
        sin(
            skyNoise * 9.0 +
            skyUV.y * 8.0
        );

    skyBands =
        pow(
            abs(skyBands),
            5.0
        );

    //////////////////////////////////////////////////
    // GROUND
    //////////////////////////////////////////////////

    vec2 groundUV =
        projectGround(world);

    float groundNoise =
        fbm(
            groundUV *
            groundDetail
        );

    float groundBands =
        sin(
            groundNoise * 12.0 +
            groundUV.y * 14.0
        );

    groundBands =
        pow(
            abs(groundBands),
            8.0
        );

    //////////////////////////////////////////////////
    // ATMOSPHERE
    //////////////////////////////////////////////////

    float mist =
        fbm(
            world * 2.0 +
            time * 0.02
        );

    //////////////////////////////////////////////////
    // HORIZON GLOW
    //////////////////////////////////////////////////

    float horizonDist =
        abs(world.y);

    float horizonLight =
        horizonGlow /
        (horizonDist + 0.04);

    //////////////////////////////////////////////////
    // COLOR
    //////////////////////////////////////////////////

    float hue =
        mod(
            time * hueSpeed +
            mist * 0.08,
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
    // FINAL COMBINE
    //////////////////////////////////////////////////

    vec3 col = prev;

    col +=
        baseColor *
        skyBands *
        skyMask *
        0.35;

    col +=
        baseColor *
        groundBands *
        groundMask *
        0.55;

    col +=
        baseColor *
        mist *
        mistStrength *
        0.25;

    col +=
        baseColor *
        horizonLight *
        0.3;

    //////////////////////////////////////////////////
    // PARTICLES
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