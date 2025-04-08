import type { Matchers, MatcherFunction } from "expect";

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInstanceOf(expected: any): R;
    }
  }
}

export {};
