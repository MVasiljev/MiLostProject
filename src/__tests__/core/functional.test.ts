import {
  pipe,
  compose,
  curry,
  memoize,
  once,
  throttle,
  debounce,
  noop,
  identity,
  not,
  allOf,
  anyOf,
  prop,
  hasProp,
  propEq,
  partial,
  flip,
  juxt,
  zipWith,
  converge,
  mergeDeep,
  mapObject,
  filterObject,
} from "../../core/functional";
import { Str } from "../../types/string";
import { Vec } from "../../types/vec";
import { u32 } from "../../types/primitives";

describe("Functional Programming Utilities", () => {
  describe("Basic Function Transformations", () => {
    it("creates pipe compositions correctly", () => {
      const add2 = (x: number) => x + 2;
      const multiply3 = (x: number) => x * 3;
      const square = (x: number) => x ** 2;

      const pipedFn = pipe(add2, multiply3, square);
      expect(pipedFn(4)).toBe(((4 + 2) * 3) ** 2);
    });

    it("creates compose compositions correctly", () => {
      const add2 = (x: number) => x + 2;
      const multiply3 = (x: number) => x * 3;
      const square = (x: number) => x ** 2;

      const composedFn = compose(square, multiply3, add2);
      expect(composedFn(4)).toBe(((4 + 2) * 3) ** 2);
    });

    it("handles curry function", () => {
      const add = curry((a: number, b: number) => a + b);
      const add5 = add(5);
      expect(add5(3)).toBe(8);
    });
  });

  describe("Memoization and Function Execution Utilities", () => {
    it("memoizes function calls", () => {
      const expensiveCalculation = jest.fn((x: number) => x * 2);
      const memoizedCalc = memoize(expensiveCalculation);

      expect(memoizedCalc(4)).toBe(8);
      expect(memoizedCalc(4)).toBe(8);
      expect(expensiveCalculation).toHaveBeenCalledTimes(1);
    });

    it("handles memoization with custom key function", () => {
      const complexFn = jest.fn((a: number, b: number) => a + b);
      const memoizedFn = memoize(complexFn, (...args) =>
        Str.fromRaw(args.join(","))
      );

      expect(memoizedFn(2, 3)).toBe(5);
      expect(memoizedFn(2, 3)).toBe(5);
      expect(complexFn).toHaveBeenCalledTimes(1);
    });

    it("uses once function", () => {
      const fn = jest.fn((x: number) => x * 2);
      const onceFn = once(fn);

      expect(onceFn(4)).toBe(8);
      expect(onceFn(5)).toBe(8);
      expect(fn).toHaveBeenCalledTimes(1);
    });
  });

  describe("Throttle and Debounce Utilities", () => {
    jest.useFakeTimers();

    it("handles throttle function", () => {
      const fn = jest.fn();
      const throttledFn = throttle(fn, u32(100));

      throttledFn(1);
      throttledFn(2);
      throttledFn(3);

      jest.advanceTimersByTime(50);
      throttledFn(4);

      jest.advanceTimersByTime(100);
      expect(fn).toHaveBeenCalledTimes(2);
    });

    it("handles debounce function", () => {
      const fn = jest.fn();
      const debouncedFn = debounce(fn, u32(100));

      debouncedFn(1);
      debouncedFn(2);
      debouncedFn(3);

      jest.advanceTimersByTime(50);
      debouncedFn(4);

      jest.advanceTimersByTime(100);
      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn).toHaveBeenLastCalledWith(4);
    });
  });

  describe("Predicate and Logical Utilities", () => {
    it("handles identity function", () => {
      expect(identity(42)).toBe(42);
      expect(identity("test")).toBe("test");
    });

    it("handles not function", () => {
      const isEven = (x: number) => x % 2 === 0;
      const isOdd = not(isEven);

      expect(isEven(4)).toBe(true);
      expect(isOdd(4)).toBe(false);
      expect(isEven(5)).toBe(false);
      expect(isOdd(5)).toBe(true);
    });

    it("handles allOf and anyOf predicates", () => {
      const isPositive = (x: number) => x > 0;
      const isEven = (x: number) => x % 2 === 0;

      const positiveEven = allOf(isPositive, isEven);
      const positiveOrEven = anyOf(isPositive, isEven);

      expect(positiveEven(-2)).toBe(false);
      expect(positiveEven(4)).toBe(true);
      expect(positiveOrEven(-2)).toBe(true);
      expect(positiveOrEven(-3)).toBe(false);
    });
  });

  describe("Object and Property Utilities", () => {
    type TestObj = {
      name: string;
      age: number;
      active: boolean;
    };

    const testObj: TestObj = {
      name: "John",
      age: 30,
      active: true,
    };

    it("handles prop function", () => {
      const getName = prop<TestObj, "name">("name");
      expect(getName(testObj)).toBe("John");
    });

    it("handles hasProp function", () => {
      const hasName = hasProp(Str.fromRaw("name"));
      expect(hasName(testObj)).toBe(true);
      expect(hasName({})).toBe(false);
    });
  });

  describe("Advanced Function Composition", () => {
    it("handles partial application", () => {
      const add = (a: number, b: number, c: number) => a + b + c;
      const addFive = partial(add, 5);

      expect(addFive(2, 3)).toBe(10);
    });

    it("handles flip function", () => {
      const divide = (a: number, b: number) => a / b;
      const flippedDivide = flip(divide);

      expect(divide(10, 2)).toBe(5);
      expect(flippedDivide(2, 10)).toBe(5);
    });

    it("handles juxt function", () => {
      const double = (x: number) => x * 2;
      const square = (x: number) => x ** 2;
      const juxtFn = juxt(
        (x: unknown) => double(x as number),
        (x: unknown) => square(x as number)
      );

      expect(juxtFn(3).toArray()).toEqual([6, 9]);
    });

    it("handles zipWith function", () => {
      const add = (a: number, b: number) => a + b;
      const vec1 = Vec.from([1, 2, 3]);
      const vec2 = Vec.from([4, 5, 6]);

      const zipped = zipWith(add, vec1, vec2);
      expect(zipped.toArray()).toEqual([5, 7, 9]);
    });
  });

  describe("Object Manipulation Utilities", () => {
    it("handles mapObject", () => {
      const testObj = {
        a: 1,
        b: 2,
        c: 3,
        d: 4,
      };
      const doubled = mapObject(testObj, (val) => val * 2);
      expect(doubled).toEqual({
        a: 2,
        b: 4,
        c: 6,
        d: 8,
      });
    });

    it("handles filterObject", () => {
      const testObj = {
        a: 1,
        b: 2,
        c: 3,
        d: 4,
      };
      const evenValues = filterObject(testObj, (val) => val % 2 === 0);
      expect(evenValues).toEqual({
        b: 2,
        d: 4,
      });
    });
  });

  describe("Miscellaneous Utilities", () => {
    it("handles noop function", () => {
      expect(() => noop()).not.toThrow();
    });
  });
});
