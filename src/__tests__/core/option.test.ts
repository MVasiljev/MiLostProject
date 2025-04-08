import { Option } from "../../core/option";
import { Vec } from "../../types/vec";
import { Str } from "../../types/string";

const useOptionFactory = () => {
  const createSomeOption = <T>(value: T) => Option.Some(value);

  const createNoneOption = <T>() => Option.None<T>();

  const createNumberOptions = () => ({
    positive: createSomeOption(42),
    zero: createSomeOption(0),
    negative: createSomeOption(-10),
    none: createNoneOption<number>(),
  });

  const generateOptionOperations = <T>(option: Option<T>) => ({
    map: <U>(fn: (value: T) => U) => option.map(fn),

    andThen: <U>(fn: (value: T) => Option<U>) => option.andThen(fn),

    filter: (predicate: (value: T) => boolean) => option.filter(predicate),
  });

  return {
    createSomeOption,
    createNoneOption,
    createNumberOptions,
    generateOptionOperations,
  };
};

const useOptionVerification = () => {
  const verifyOptionState = <T>(option: Option<T>) => ({
    isSome: () => expect(option.isSome()).toBe(true),

    isNone: () => expect(option.isNone()).toBe(true),

    unwrapsTo: (expectedValue: T) =>
      expect(option.unwrap()).toBe(expectedValue),
  });

  const verifyOptionTransformation = <T, U>(
    original: Option<T>,
    transformed: Option<U>
  ) => ({
    transformationPreservesSomeState: () =>
      expect(original.isSome()).toBe(transformed.isSome()),

    transformationPreservesNoneState: () =>
      expect(original.isNone()).toBe(transformed.isNone()),
  });

  return {
    verifyOptionState,
    verifyOptionTransformation,
  };
};

describe("Option Advanced Transformations", () => {
  const {
    createSomeOption,
    createNoneOption,
    createNumberOptions,
    generateOptionOperations,
  } = useOptionFactory();

  const { verifyOptionState, verifyOptionTransformation } =
    useOptionVerification();

  describe("Option Creation and Basic Operations", () => {
    it("creates Some and None options correctly", () => {
      const someNum = createSomeOption(42);
      const noneNum = createNoneOption<number>();

      const someNumState = verifyOptionState(someNum);
      const noneNumState = verifyOptionState(noneNum);

      someNumState.isSome();
      someNumState.unwrapsTo(42);

      noneNumState.isNone();
    });

    it("prevents creating Some with null or undefined", () => {
      expect(() => Option.Some(null as any)).toThrow();
      expect(() => Option.Some(undefined as any)).toThrow();
    });
  });

  describe("Option Transformation Methods", () => {
    it("maps Some options correctly", () => {
      const someNum = createSomeOption(42);
      const optionOps = generateOptionOperations(someNum);

      const mapped = optionOps.map((x) => x.toString());
      const verifyTransform = verifyOptionTransformation(someNum, mapped);

      verifyTransform.transformationPreservesSomeState();
      verifyOptionState(mapped).unwrapsTo("42");
    });

    it("maps None options preserves None state", () => {
      const noneNum = createNoneOption<number>();
      const optionOps = generateOptionOperations(noneNum);

      const mapped = optionOps.map((x) => x * 2);
      const verifyTransform = verifyOptionTransformation(noneNum, mapped);

      verifyTransform.transformationPreservesSomeState();
      verifyOptionState(mapped).isNone();
    });

    it("andThen transforms Some options", () => {
      const someNum = createSomeOption(42);
      const optionOps = generateOptionOperations(someNum);

      const andThenResult = optionOps.andThen((x) =>
        x > 40 ? Option.Some(x.toString()) : Option.None()
      );

      verifyOptionState(andThenResult).isSome();
      verifyOptionState(andThenResult).unwrapsTo("42");
    });

    it("andThen preserves None state", () => {
      const noneNum = createNoneOption<number>();
      const optionOps = generateOptionOperations(noneNum);

      const andThenResult = optionOps.andThen((x) => Option.Some(x * 2));

      verifyOptionState(andThenResult).isNone();
    });
  });

  describe("Option Filtering and Combination", () => {
    it("filters Some options correctly", () => {
      const someNum = createSomeOption(42);
      const optionOps = generateOptionOperations(someNum);

      const filteredTrue = optionOps.filter((x) => x > 40);
      const filteredFalse = optionOps.filter((x) => x < 0);

      verifyOptionState(filteredTrue).isSome();
      verifyOptionState(filteredTrue).unwrapsTo(42);

      verifyOptionState(filteredFalse).isNone();
    });

    it("combines matching options correctly", () => {
      const { positive, zero, negative, none } = createNumberOptions();

      const combinedSome = Option.all(Vec.from([positive, zero, negative]));

      const combinedWithNone = Option.all(Vec.from([positive, none]));

      verifyOptionState(combinedWithNone).isNone();
    });

    it("finds first some option", () => {
      const { positive, negative, none } = createNumberOptions();

      const firstSome = Option.firstSome(none, negative, positive);

      verifyOptionState(firstSome).isSome();
      verifyOptionState(firstSome).unwrapsTo(-10);
    });
  });

  describe("Option Error Handling", () => {
    it("unwrap throws on None", () => {
      const noneNum = createNoneOption<number>();

      expect(() => noneNum.unwrap()).toThrow();
    });

    it("unwrapOr returns default value for None", () => {
      const noneNum = createNoneOption<number>();

      expect(noneNum.unwrapOr(100)).toBe(100);
    });

    it("expect throws with custom message on None", () => {
      const noneStr = createNoneOption<string>();

      expect(() => noneStr.expect(Str.fromRaw("Custom error message"))).toThrow(
        "Custom error message"
      );
    });
  });
});
