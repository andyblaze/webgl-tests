export function mt_rand(min = 0, max = 2147483647) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
