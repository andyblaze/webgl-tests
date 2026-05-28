export function mt_randf(min, max) {
    return min + Math.random() * (max - min);
}

export function mt_rand(min, max) {
    return Math.floor(mt_randf(min, max + 1));
}
export function createOptions(px, py, r, pvx, pvy) {
    return {
        radius: r,
        x: px,
        y: py,
        vx: pvx,
        vy: pvy
    };
}
