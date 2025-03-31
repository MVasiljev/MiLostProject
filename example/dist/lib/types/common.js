import { Vec } from ".";
import { identity } from "../core";
import { limits } from "./primitives";
import { Str } from "./string";
export const LoadingStates = {
    IDLE: Str.fromRaw("idle"),
    LOADING: Str.fromRaw("loading"),
    SUCCEEDED: Str.fromRaw("succeeded"),
    FAILED: Str.fromRaw("failed"),
};
export function isDefined(value) {
    return value !== null && value !== undefined;
}
export function isObject(value) {
    return typeof value === "object" && value !== null && !isVec(value);
}
export function isVec(value) {
    return value instanceof Vec;
}
export function isStr(value) {
    return value instanceof Str;
}
export function isNumeric(value) {
    if (typeof value !== "number" || Number.isNaN(value))
        return false;
    const numValue = value;
    if (Number.isInteger(numValue)) {
        if (numValue >= limits.u32[0] && numValue <= limits.u32[1])
            return true;
        if (numValue >= limits.i32[0] && numValue <= limits.i32[1])
            return true;
    }
    if (Number.isFinite(numValue)) {
        if (numValue >= limits.f64[0] && numValue <= limits.f64[1])
            return true;
    }
    return false;
}
export function isBoolean(value) {
    return typeof value === "boolean";
}
export function isFunction(value) {
    return typeof value === "function";
}
export const BrandTypes = {
    JSON: Str.fromRaw("Json"),
    POSITIVE: Str.fromRaw("Positive"),
    NEGATIVE: Str.fromRaw("Negative"),
    NON_NEGATIVE: Str.fromRaw("NonNegative"),
    PERCENTAGE: Str.fromRaw("Percentage"),
};
export function iterableToVec(iterable) {
    return Vec.from(iterable);
}
export const Types = {
    isDefined,
    isObject,
    isVec,
    isStr,
    isNumeric,
    isBoolean,
    isFunction,
    identity,
    iterableToVec,
};
