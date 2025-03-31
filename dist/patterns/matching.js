import { Result, ValidationError } from "../core";
import { Str, Vec } from "../types";
import { Option } from "../core/option";
export const SomePattern = Symbol("Some");
export const NonePattern = Symbol("None");
export const OkPattern = Symbol("Ok");
export const ErrPattern = Symbol("Err");
export const _ = Symbol("_");
export class PatternMatcher {
    static _type = "PatternMatcher";
    static is = {
        nullish: (val) => val === null || val === undefined,
        str: (val) => val instanceof Str,
        rawString: (val) => typeof val === "string",
        numeric: (val) => (typeof val === "number" && !isNaN(val)) ||
            (val instanceof Number && !isNaN(val.valueOf())),
        rawNumber: (val) => typeof val === "number" && !isNaN(val),
        boolean: (val) => typeof val === "boolean",
        vec: (val) => val instanceof Vec,
        object: (val) => val !== null &&
            typeof val === "object" &&
            !(val instanceof Vec) &&
            !(val instanceof Str) &&
            !(val instanceof Array),
        function: (val) => typeof val === "function",
        some: (val) => val.isSome(),
        none: (val) => val.isNone(),
        ok: (val) => val.isOk(),
        err: (val) => val.isErr(),
        empty: (val) => {
            if (val === null || val === undefined)
                return true;
            if (val instanceof Str)
                return val.unwrap().length === 0;
            if (val instanceof Vec)
                return val.isEmpty();
            if (typeof val === "string")
                return val.length === 0;
            if (typeof val === "object")
                return Object.keys(val).length === 0;
            return false;
        },
        equalTo: (target) => (val) => val === target,
        inRange: (min, max) => (val) => val >= min &&
            val <= max,
        predicate: (fn) => fn,
    };
    static matchesPattern(value, pattern) {
        if (pattern === _) {
            return true;
        }
        if (pattern === SomePattern) {
            return value instanceof Option && value.isSome();
        }
        if (pattern === NonePattern) {
            return value instanceof Option && value.isNone();
        }
        if (pattern === OkPattern) {
            return value instanceof Result && value.isOk();
        }
        if (pattern === ErrPattern) {
            return value instanceof Result && value.isErr();
        }
        if (typeof pattern === "function") {
            return pattern(value);
        }
        if (typeof pattern === "object" &&
            pattern !== null &&
            !(pattern instanceof Array) &&
            !(pattern instanceof Vec)) {
            if (typeof value !== "object" || value === null) {
                return false;
            }
            for (const key in pattern) {
                if (Object.prototype.hasOwnProperty.call(pattern, key)) {
                    if (!(key in value)) {
                        return false;
                    }
                    if (!PatternMatcher.matchesPattern(value[key], pattern[key])) {
                        return false;
                    }
                }
            }
            return true;
        }
        return value === pattern;
    }
    static extractValue(value, pattern) {
        if (pattern === SomePattern && value instanceof Option) {
            return value.unwrap();
        }
        if (pattern === ErrPattern && value instanceof Result) {
            return value.getError();
        }
        return value;
    }
}
export function matchValue(value, patterns) {
    if (!Array.isArray(patterns)) {
        if (value instanceof Option) {
            if (value.isSome() && "Some" in patterns) {
                return patterns.Some(value.unwrap());
            }
            else if (value.isNone() && "None" in patterns) {
                return patterns.None(value);
            }
            if ("_" in patterns) {
                return patterns._(value);
            }
            throw new ValidationError(Str.fromRaw("No matching pattern found for Option value"));
        }
        if (value instanceof Result) {
            if (value.isOk() && "Ok" in patterns) {
                return patterns.Ok(value.unwrap());
            }
            else if (value.isErr() && "Err" in patterns) {
                return patterns.Err(value.getError());
            }
            if ("_" in patterns) {
                return patterns._(value);
            }
            throw new ValidationError(Str.fromRaw("No matching pattern found for Result value"));
        }
        const patternArray = [];
        for (const key in patterns) {
            if (key === "Some" && patterns[key] !== undefined)
                patternArray.push([SomePattern, patterns[key]]);
            else if (key === "None" && patterns[key] !== undefined)
                patternArray.push([NonePattern, patterns[key]]);
            else if (key === "Ok" && patterns[key] !== undefined)
                patternArray.push([OkPattern, patterns[key]]);
            else if (key === "Err" && patterns[key] !== undefined)
                patternArray.push([ErrPattern, patterns[key]]);
            else if (key === "_" && patterns[key] !== undefined)
                patternArray.push([_, patterns[key]]);
            else if (patterns[key] !== undefined)
                patternArray.push([key, patterns[key]]);
        }
        return matchValue(value, patternArray);
    }
    for (const [pattern, handler] of patterns) {
        if (PatternMatcher.matchesPattern(value, pattern)) {
            return handler(PatternMatcher.extractValue(value, pattern));
        }
    }
    throw new ValidationError(Str.fromRaw("No pattern matched and no default provided"));
}
export function matchPattern(value, patterns, defaultFn) {
    for (const [predicate, handler] of patterns) {
        if (predicate(value)) {
            return handler(value);
        }
    }
    if (defaultFn) {
        return defaultFn(value);
    }
    throw new ValidationError(Str.fromRaw("No pattern matched and no default provided"));
}
export function matchType(value, patterns) {
    if (value instanceof Str && patterns.str) {
        return patterns.str(value);
    }
    if (typeof value === "string" && patterns.rawString) {
        return patterns.rawString(value);
    }
    if (PatternMatcher.is.numeric(value) && patterns.numeric) {
        return patterns.numeric(value);
    }
    if (typeof value === "number" && patterns.rawNumber) {
        return patterns.rawNumber(value);
    }
    if (typeof value === "boolean" && patterns.boolean) {
        return patterns.boolean(value);
    }
    if (value instanceof Vec && patterns.vec) {
        return patterns.vec(value);
    }
    if (value !== null &&
        typeof value === "object" &&
        !(value instanceof Vec) &&
        !(value instanceof Str) &&
        patterns.object) {
        return patterns.object(value);
    }
    if (value === null && patterns.null) {
        return patterns.null();
    }
    if (value === undefined && patterns.undefined) {
        return patterns.undefined();
    }
    if (patterns.default) {
        return patterns.default(value);
    }
    throw new ValidationError(Str.fromRaw("No pattern matched and no default provided"));
}
export function matchTag(value, patterns, defaultFn) {
    let tag;
    if ("type" in value) {
        tag = value.type;
    }
    else if ("kind" in value) {
        tag = value.kind;
    }
    else if ("tag" in value) {
        tag = value.tag;
    }
    if (tag !== undefined) {
        const tagStr = tag.unwrap();
        if (tagStr in patterns && patterns[tagStr]) {
            return patterns[tagStr](value);
        }
    }
    if (defaultFn) {
        return defaultFn(value);
    }
    const tagDisplay = tag ? tag.unwrap() : "undefined";
    throw new ValidationError(Str.fromRaw(`No pattern matched for tag "${tagDisplay}" and no default provided`));
}
export function matchCases(value, cases, defaultCase) {
    try {
        return matchValue(value, cases);
    }
    catch (e) {
        if (defaultCase) {
            return defaultCase();
        }
        throw e;
    }
}
export var Patterns;
(function (Patterns) {
    Patterns.Some = SomePattern;
    Patterns.None = NonePattern;
    Patterns.Ok = OkPattern;
    Patterns.Err = ErrPattern;
    Patterns.Wildcard = _;
    Patterns.match = matchValue;
    Patterns.pattern = matchPattern;
    Patterns.type = matchType;
    Patterns.tag = matchTag;
    Patterns.cases = matchCases;
    Patterns.is = PatternMatcher.is;
})(Patterns || (Patterns = {}));
export { matchValue as match };
