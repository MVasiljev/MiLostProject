import { Iter } from "../../core/iter";
import { Vec } from "../../types/vec";
import { u32, i32 } from "../../types/primitives";

const useIterFactory = () => {
  const createNumberIter = (values: number[] = [1, 2, 3, 4, 5]) =>
    Iter.from(values);

  const createStringIter = (values: string[] = ["a", "b", "c"]) =>
    Iter.from(values);

  const createMixedIter = () => Iter.from([1, "two", true, { key: "value" }]);

  const generateIterOperations = <T>(iter: Iter<T>) => ({
    map: <U>(fn: (item: T, index: u32) => U) => iter.map(fn),
    filter: (predicate: (item: T, index: u32) => boolean) =>
      iter.filter(predicate),
    flatMap: <U>(fn: (item: T) => Iterable<U>) => iter.flatMap(fn),
  });

  return {
    createNumberIter,
    createStringIter,
    createMixedIter,
    generateIterOperations,
  };
};

const useIterVerification = () => {
  const verifyIterTransformation = <T, U>(
    original: Iter<T>,
    transformed: Iter<U>
  ) => ({
    checkTransformationPreservesLength: (expectedLength: number) =>
      expect(transformed.count()).toBe(u32(expectedLength)),
  });

  const verifyIterProperties = <T>(iter: Iter<T>) => {
    const iterCollection = iter.collect();
    return {
      count: (expectedCount: number) =>
        expect(iter.count()).toBe(u32(expectedCount)),

      isEmpty: () => expect(iterCollection.isEmpty()).toBe(true),

      isNotEmpty: () => expect(iterCollection.isEmpty()).toBe(false),
    };
  };

  return {
    verifyIterTransformation,
    verifyIterProperties,
  };
};

describe("Iter Advanced Transformations", () => {
  const {
    createNumberIter,
    createStringIter,
    createMixedIter,
    generateIterOperations,
  } = useIterFactory();

  const { verifyIterTransformation, verifyIterProperties } =
    useIterVerification();

  describe("Iter Creation and Basic Operations", () => {
    it("creates iterators from different sources", () => {
      const numberIter = createNumberIter();
      const stringIter = createStringIter();
      const mixedIter = createMixedIter();

      const numberProps = verifyIterProperties(numberIter);
      const stringProps = verifyIterProperties(stringIter);
      const mixedProps = verifyIterProperties(mixedIter);

      numberProps.count(5);
      numberProps.isNotEmpty();

      stringProps.count(3);
      stringProps.isNotEmpty();

      mixedProps.count(4);
      mixedProps.isNotEmpty();
    });

    it("handles range iteration", () => {
      const rangeIter = Iter.range(i32(0), i32(5));

      expect(rangeIter.collect().toArray()).toEqual([0, 1, 2, 3, 4]);
      expect(rangeIter.count()).toBe(u32(5));
    });

    it("handles range with custom step", () => {
      const rangeIter = Iter.range(i32(0), i32(10), i32(2));

      expect(rangeIter.collect().toArray()).toEqual([0, 2, 4, 6, 8]);
    });

    it("handles negative step range", () => {
      const rangeIter = Iter.range(i32(5), i32(0), i32(-1));

      expect(rangeIter.collect().toArray()).toEqual([5, 4, 3, 2, 1]);
    });

    it("throws on zero step size in range", () => {
      expect(() => Iter.range(i32(0), i32(5), i32(0))).toThrow(
        "Step cannot be zero"
      );
    });
  });

  describe("Iter Transformation Methods", () => {
    it("performs map transformations", () => {
      const numberIter = createNumberIter();
      const iterOps = generateIterOperations(numberIter);

      const doubledIter = iterOps.map((x, index) => x * (index + 1));
      const verifyTransform = verifyIterTransformation(numberIter, doubledIter);

      verifyTransform.checkTransformationPreservesLength(5);
      expect(doubledIter.collect().toArray()).toEqual([1, 4, 9, 16, 25]);
    });

    it("filters elements with complex predicate", () => {
      const numberIter = createNumberIter();
      const iterOps = generateIterOperations(numberIter);

      const evenIndexElements = iterOps.filter((_, index) => index % 2 === 0);
      const verifyTransform = verifyIterTransformation(
        numberIter,
        evenIndexElements
      );

      verifyTransform.checkTransformationPreservesLength(3);
      expect(evenIndexElements.collect().toArray()).toEqual([1, 3, 5]);
    });

    it("handles flatMap transformation", () => {
      const numberIter = createNumberIter();
      const iterOps = generateIterOperations(numberIter);

      const flatMappedIter = iterOps.flatMap((x) => [x, x * 10]);
      const verifyTransform = verifyIterTransformation(
        numberIter,
        flatMappedIter
      );

      verifyTransform.checkTransformationPreservesLength(10);
      expect(flatMappedIter.collect().toArray()).toEqual([
        1, 10, 2, 20, 3, 30, 4, 40, 5, 50,
      ]);
    });
  });

  describe("Iter Advanced Methods", () => {
    it("handles chaining and zipping", () => {
      const numberIter1 = createNumberIter([1, 2, 3]);
      const numberIter2 = createNumberIter([4, 5, 6]);

      const zippedIter = numberIter1.zip(numberIter2);
      const chainedIter = numberIter1.chain(numberIter2);

      expect(zippedIter.collect().toArray()).toEqual([
        [1, 4],
        [2, 5],
        [3, 6],
      ]);
      expect(chainedIter.collect().toArray()).toEqual([1, 2, 3, 4, 5, 6]);
    });

    it("finds elements with find and first/last methods", () => {
      const numberIter = createNumberIter();

      const evenNumber = numberIter.find((x) => x % 2 === 0);
      const firstElement = numberIter.first();
      const lastElement = numberIter.last();

      expect(evenNumber.unwrap()).toBe(2);
      expect(firstElement.unwrap()).toBe(1);
      expect(lastElement.unwrap()).toBe(5);
    });

    it("checks all and any predicates", () => {
      const numberIter = createNumberIter();

      const allPositive = numberIter.all((x) => x > 0);
      const anyEven = numberIter.any((x) => x % 2 === 0);
      const allEven = numberIter.all((x) => x % 2 === 0);

      expect(allPositive).toBe(true);
      expect(anyEven).toBe(true);
      expect(allEven).toBe(false);
    });
  });

  describe("Iter Edge Cases", () => {
    it("handles empty iterator", () => {
      const emptyIter = Iter.empty<number>();
      const emptyProps = verifyIterProperties(emptyIter);

      emptyProps.count(0);
      emptyProps.isEmpty();

      expect(emptyIter.first().isNone()).toBe(true);
      expect(emptyIter.last().isNone()).toBe(true);
      expect(emptyIter.find(() => true).isNone()).toBe(true);
    });

    it("handles single element iterator", () => {
      const singleElementIter = Iter.from([42]);
      const singleProps = verifyIterProperties(singleElementIter);

      singleProps.count(1);
      singleProps.isNotEmpty();

      expect(singleElementIter.first().unwrap()).toBe(42);
      expect(singleElementIter.last().unwrap()).toBe(42);
    });
  });

  describe("Iter Specialized Methods", () => {
    it("handles take and skip operations", () => {
      const numberIter = createNumberIter();

      const firstThree = numberIter.take(u32(3));
      const skipFirst = numberIter.skip(u32(2));

      expect(firstThree.collect().toArray()).toEqual([1, 2, 3]);
      expect(skipFirst.collect().toArray()).toEqual([3, 4, 5]);
    });

    it("handles enumerate method", () => {
      const numberIter = createNumberIter();

      const enumerated = numberIter.enumerate();
      const result = enumerated.collect().toArray();

      expect(result).toEqual([
        [u32(0), 1],
        [u32(1), 2],
        [u32(2), 3],
        [u32(3), 4],
        [u32(4), 5],
      ]);
    });

    it("handles chunks method", () => {
      const numberIter = createNumberIter();

      const chunkedByTwo = numberIter.chunks(u32(2));
      const result = chunkedByTwo.collect().toArray();

      expect(result).toEqual([
        Vec.from([1, 2]),
        Vec.from([3, 4]),
        Vec.from([5]),
      ]);
    });
  });
});
