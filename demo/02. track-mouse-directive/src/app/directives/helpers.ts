export function clamp(min: number, num: number, max: number) {
    return Math.min(Math.max(num, min), max);
}