import { Tuple } from "../../types";

describe("Tuple", () => {
  it("creates a tuple from elements", () => {
    const t = Tuple.from(1, "two", true);
    expect(t.toArray()).toEqual([1, "two", true]);
    expect(t.get(0)).toBe(1);
    expect(t.get(1)).toBe("two");
    expect(t.get(2)).toBe(true);
  });

  it("allows replacing tuple elements immutably", () => {
    const t1 = Tuple.from("a", "b", "c");
    const t2 = t1.replace(1, "beta");
    expect(t1.toArray()).toEqual(["a", "b", "c"]);
    expect(t2.toArray()).toEqual(["a", "beta", "c"]);
  });

  it("retrieves first and second elements", () => {
    const t = Tuple.from("alpha", "beta", "gamma");
    expect(t.first()).toBe("alpha");
    expect(t.second()).toBe("beta");
  });

  it("handles various primitive and object types", () => {
    const now = new Date();
    const s = Symbol("x");
    const t = Tuple.from(null, undefined, NaN, now, s);
    const array = t.toArray();
    expect(array[0]).toBeNull();
    expect(array[1]).toBeUndefined();
    expect(Number.isNaN(array[2])).toBe(true);
    expect(array[3]).toBe(now);
    expect(array[4]).toBe(s);
  });

  it("handles nested tuples and deeply structured content", () => {
    const inner = Tuple.from("inner", 42);
    const outer = Tuple.from(
      "outer",
      inner,
      Tuple.from("deep", Tuple.from("deeper"))
    );
    expect(outer.get(1).get(0)).toBe("inner");
    expect(outer.get(2).get(1).get(0)).toBe("deeper");
  });

  it("works with mixed types and complex object contents", () => {
    const obj = { a: 1, b: { c: [2, 3] } };
    const arr = [1, 2, 3];
    const t = Tuple.from(obj, arr, new Map([[1, "one"]]));
    expect(t.get(0)).toEqual(obj);
    expect(t.get(1)).toEqual(arr);
    expect(t.get(2).get(1)).toBe("one");
  });

  it("is robust with edge cases like very large tuples", () => {
    const big = Array.from({ length: 1000 }, (_, i) => i);
    const t = Tuple.from(...big);
    expect(t.get(999)).toBe(999);
    expect(t.toArray().length).toBe(1000);
  });

  it("handles strings with complex Unicode (emoji, RTL, ZWJ, etc.)", () => {
    const complex = Tuple.from("👩‍💻", "🇺🇳", "مرحبا", "𝒜𝒷𝒸", "a\u0301");
    expect(complex.get(0)).toBe("👩‍💻");
    expect(complex.get(2)).toBe("مرحبا");
  });

  it("maintains immutability", () => {
    const original = Tuple.from(1, 2, 3);
    const modified = original.replace(1, 42);
    expect(original.toArray()).toEqual([1, 2, 3]);
    expect(modified.toArray()).toEqual([1, 42, 3]);
  });

  it("handles large Tuples (stress test)", () => {
    const size = 1000;
    const arr = Array.from({ length: size }, (_, i) => i);
    const bigTuple = Tuple.from(...arr, "a", null);

    for (let i = 0; i < size; i += 100) {
      expect(bigTuple.get(i)).toBe(i);
    }

    const replaced = bigTuple.replace(500, "halfway");
    expect(replaced.get(500)).toBe("halfway");
  });
});
