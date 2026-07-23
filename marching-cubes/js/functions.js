// Integer in the range [lo, hi] (inclusive)
export function mt_rand(lo, hi) {
    if (lo > hi) [lo, hi] = [hi, lo];
    lo = Math.ceil(lo);
    hi = Math.floor(hi);
    return Math.floor(Math.random() * (hi - lo + 1)) + lo;
}

// Float in the range [lo, hi)
export function mt_randf(lo, hi) {
    if (lo > hi) [lo, hi] = [hi, lo];
    return Math.random() * (hi - lo) + lo;
}

export function mt_randfs(range) {
    return (Math.random() * 2 - 1) * range;
}