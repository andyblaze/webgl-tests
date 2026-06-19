export function byId(id) {
    return document.getElementById(id);
}

export function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}