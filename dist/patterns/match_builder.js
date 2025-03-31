export const __ = Symbol("Wildcard");
export class MatchBuilder {
    value;
    arms = [];
    constructor(value) {
        this.value = value;
    }
    with(pattern, handler) {
        this.arms.push({ pattern, handler });
        return this;
    }
    otherwise(defaultHandler) {
        for (const arm of this.arms) {
            if (this.matchPattern(arm.pattern, this.value)) {
                return arm.handler(this.value);
            }
        }
        return defaultHandler(this.value);
    }
    matchPattern(pattern, value) {
        if (pattern === __)
            return true;
        if (typeof pattern === "function")
            return pattern(value);
        return pattern === value;
    }
}
export function build(value) {
    return new MatchBuilder(value);
}
