import { Vec } from "../../types/vec";
import { u32 } from "../../types/primitives";

const useVecFactory = () => {
  const createNumberVec = (values: number[] = [1, 2, 3, 4, 5]) =>
    Vec.from(values);

  const createStringVec = (values: string[] = ["a", "b", "c"]) =>
    Vec.from(values);

  const createMixedVec = () => Vec.from([1, "two", true, { key: "value" }]);

  const generateVecOperations = <T>(vec: Vec<T>) => ({
    map: <U>(fn: (item: T, index: u32) => U) => vec.map(fn),

    filter: (predicate: (item: T, index: u32) => boolean) =>
      vec.filter(predicate),

    fold: <R>(initial: R, fn: (acc: R, item: T, index: u32) => R) =>
      vec.fold(initial, fn),
  });

  return {
    createNumberVec,
    createStringVec,
    createMixedVec,
    generateVecOperations,
  };
};

const useVecVerification = () => {
  const verifyImmutability = <T>(original: Vec<T>, transformed: Vec<T>) => {
    const originalValues = original.toArray();

    return {
      originalUnchanged: () =>
        expect(original.toArray()).toEqual(originalValues),

      transformedDifferent: (expectedValues: T[]) =>
        expect(transformed.toArray()).toEqual(expectedValues),
    };
  };

  const verifyVecProperties = <T>(vec: Vec<T>) => ({
    length: (expectedLength: number) =>
      expect(vec.len()).toBe(u32(expectedLength)),

    isEmpty: () => expect(vec.isEmpty()).toBe(true),

    isNotEmpty: () => expect(vec.isEmpty()).toBe(false),
  });

  return {
    verifyImmutability,
    verifyVecProperties,
  };
};

describe("Vec Advanced Transformations", () => {
  const {
    createNumberVec,
    createStringVec,
    createMixedVec,
    generateVecOperations,
  } = useVecFactory();

  const { verifyImmutability, verifyVecProperties } = useVecVerification();

  describe("Numeric Vector Operations", () => {
    it("performs complex map transformations", () => {
      const vec = createNumberVec();
      const vecOps = generateVecOperations(vec);

      const complexMap = vecOps.map((x, index) => x * (index + 1));

      verifyImmutability(vec, complexMap).originalUnchanged();
      expect(complexMap.toArray()).toEqual([1, 4, 9, 16, 25]);
    });

    it("filters with index-based predicate", () => {
      const vec = createNumberVec();
      const vecOps = generateVecOperations(vec);

      const evenIndexElements = vecOps.filter((_, index) => index % 2 === 0);

      verifyImmutability(vec, evenIndexElements).originalUnchanged();
      expect(evenIndexElements.toArray()).toEqual([1, 3, 5]);
    });

    it("performs advanced fold operations", () => {
      const vec = createNumberVec();
      const vecOps = generateVecOperations(vec);

      const sumWithIndex = vecOps.fold(
        0,
        (acc, item, index) => acc + item * (index + 1)
      );

      expect(sumWithIndex).toBe(55);
    });
  });

  describe("Vector Edge Cases", () => {
    it("handles single-element vectors", () => {
      const singleElementVec = Vec.from([42]);
      const vecProps = verifyVecProperties(singleElementVec);

      vecProps.length(1);
      vecProps.isNotEmpty();
      expect(singleElementVec.toArray()).toEqual([42]);
    });

    it("handles empty vector operations", () => {
      const emptyVec = Vec.empty<number>();
      const vecProps = verifyVecProperties(emptyVec);
      const vecOps = generateVecOperations(emptyVec);

      vecProps.length(0);
      vecProps.isEmpty();

      const mappedEmpty = vecOps.map((x) => x * 2);
      const filteredEmpty = vecOps.filter(() => true);
      const foldedEmpty = vecOps.fold(0, (acc) => acc);

      verifyImmutability(emptyVec, mappedEmpty).originalUnchanged();
      verifyImmutability(emptyVec, filteredEmpty).originalUnchanged();
      expect(mappedEmpty.toArray()).toEqual([]);
      expect(filteredEmpty.toArray()).toEqual([]);
      expect(foldedEmpty).toBe(0);
    });
  });

  describe("Mixed Type Vector Handling", () => {
    it("supports vectors with mixed types", () => {
      const mixedVec = createMixedVec();
      const vecProps = verifyVecProperties(mixedVec);

      vecProps.length(4);
      vecProps.isNotEmpty();

      const stringified = mixedVec.map((item) => String(item));
      expect(stringified.toArray()).toEqual([
        "1",
        "two",
        "true",
        "[object Object]",
      ]);
    });

    it("filters mixed type vectors", () => {
      const mixedVec = createMixedVec();
      const vecOps = generateVecOperations(mixedVec);

      const numericFilter = vecOps.filter((item) => typeof item === "number");
      const objectFilter = vecOps.filter((item) => typeof item === "object");

      expect(numericFilter.toArray()).toEqual([1]);
      expect(objectFilter.toArray()).toEqual([{ key: "value" }]);
    });
  });

  describe("Specialized Vector Transformations", () => {
    it("creates vector from different iterables", () => {
      const fromArray = Vec.from([1, 2, 3]);
      const fromSet = Vec.from(new Set([4, 5, 6]));
      const fromGenerator = Vec.from(
        (function* () {
          yield 7;
          yield 8;
          yield 9;
        })()
      );

      expect(fromArray.toArray()).toEqual([1, 2, 3]);
      expect(fromSet.toArray()).toEqual([4, 5, 6]);
      expect(fromGenerator.toArray()).toEqual([7, 8, 9]);
    });
  });
});
