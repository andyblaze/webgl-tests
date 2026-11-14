export function mt_rand(min = 0, max = 2147483647) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
// Convert degrees to radians
export const deg2rad = (degrees) => degrees * Math.PI / 180;

// Convert radians to degrees
export const rad2deg = (radians) => radians * 180 / Math.PI;