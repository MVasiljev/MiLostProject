import { HashMap, HashSet, Vec, Str, u32 } from "../types";
export function toHashMap(iterator, keyValueFn) {
    const pairs = iterator.map(keyValueFn).collect();
    return HashMap.from(pairs);
}
export function toHashSet(iterator) {
    return HashSet.from(iterator.collect());
}
export function toVec(iterator) {
    return Vec.from(iterator.collect());
}
export function mapObject(obj, fn) {
    const result = {};
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            result[key] = fn(obj[key], key);
        }
    }
    return result;
}
export function filterObject(obj, predicate) {
    const result = {};
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key) &&
            predicate(obj[key], key)) {
            result[key] = obj[key];
        }
    }
    return result;
}
export function mergeDeep(target, ...sources) {
    if (!sources.length)
        return target;
    const source = sources.shift();
    if (source === undefined)
        return target;
    if (isMergeableObject(target) && isMergeableObject(source)) {
        Object.keys(source).forEach((key) => {
            if (isMergeableObject(source[key])) {
                if (!target[key]) {
                    Object.assign(target, { [key]: {} });
                }
                if (source[key] !== undefined) {
                    mergeDeep(target[key], source[key]);
                }
            }
            else {
                Object.assign(target, { [key]: source[key] });
            }
        });
    }
    return mergeDeep(target, ...sources);
}
function isMergeableObject(item) {
    return (item &&
        typeof item === "object" &&
        !(item instanceof Vec) &&
        !(item instanceof HashMap) &&
        !(item instanceof HashSet));
}
export function pipe(...fns) {
    return (arg) => Vec.from(fns).fold(arg, (result, fn) => fn(result));
}
export function compose(...fns) {
    return (arg) => Vec.from(fns)
        .reverse()
        .fold(arg, (result, fn) => fn(result));
}
export function curry(fn) {
    return function curried(...args) {
        if (args.length >= fn.length) {
            return fn(...args);
        }
        return function (...moreArgs) {
            return curried(...args, ...moreArgs);
        };
    };
}
export function memoize(fn, keyFn) {
    const cache = HashMap.empty();
    return (...args) => {
        const key = keyFn ? keyFn(...args) : Str.fromRaw(JSON.stringify(args));
        const cached = cache.get(key);
        if (cached !== undefined) {
            return cached;
        }
        const result = fn(...args);
        cache.insert(key, result);
        return result;
    };
}
export function once(fn) {
    let called = false;
    let result;
    return (...args) => {
        if (!called) {
            result = fn(...args);
            called = true;
        }
        return result;
    };
}
export function throttle(fn, wait) {
    let lastCall = 0;
    let timeout = null;
    let lastArgs = null;
    return (...args) => {
        const now = Date.now();
        const waitMs = wait;
        if (now - lastCall >= waitMs) {
            if (timeout !== null) {
                clearTimeout(timeout);
                timeout = null;
            }
            lastCall = now;
            fn(...args);
        }
        else {
            lastArgs = args;
            if (timeout === null) {
                timeout = setTimeout(() => {
                    if (lastArgs !== null) {
                        lastCall = Date.now();
                        fn(...lastArgs);
                    }
                    timeout = null;
                }, waitMs - (now - lastCall));
            }
        }
    };
}
export function debounce(fn, wait) {
    let timeout = null;
    return (...args) => {
        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(() => {
            fn(...args);
            timeout = null;
        }, wait);
    };
}
export function noop() { }
export function identity(value) {
    return value;
}
export function not(predicate) {
    return (value) => !predicate(value);
}
export function allOf(...predicates) {
    return (value) => Vec.from(predicates).all((predicate) => predicate(value));
}
export function anyOf(...predicates) {
    return (value) => Vec.from(predicates).any((predicate) => predicate(value));
}
export function prop(key) {
    return (obj) => obj[key];
}
export function hasProp(key) {
    return (obj) => {
        return typeof obj === "object" && obj !== null && key.unwrap() in obj;
    };
}
export function propEq(key, value) {
    return (obj) => obj[key] === value;
}
export function partial(fn, ...partialArgs) {
    return (...args) => fn(...[...partialArgs, ...args]);
}
export function flip(fn) {
    return (b, a) => fn(a, b);
}
export function juxt(...fns) {
    return (arg) => Vec.from(fns.map((fn) => fn(arg)));
}
export function zipWith(fn, as, bs) {
    const result = [];
    const minLen = Math.min(as.len(), bs.len());
    for (let i = 0; i < minLen; i++) {
        const a = as.get(u32(i)).unwrap();
        const b = bs.get(u32(i)).unwrap();
        result.push(fn(a, b));
    }
    return Vec.from(result);
}
export function converge(after, fns) {
    return (...args) => {
        const results = Vec.from(fns.map((fn) => fn(...args)));
        return after(results);
    };
}
//# sourceMappingURL=functional.js.map