import { Result, Ok, Err } from "../../core/result";
import { Vec } from "../../types/vec";
import { Str } from "../../types/string";
import { AppError, ValidationError, NetworkError } from "../../core/error";

const useResultHelpers = () => {
  const safeMultiply = (value: unknown): number => {
    if (typeof value === "number") {
      return value * 2;
    }
    throw new ValidationError(Str.fromRaw("Invalid type for multiplication"));
  };

  const safeConvert = (value: unknown): string => {
    return String(value);
  };

  return {
    safeMultiply,
    safeConvert,
  };
};

const useResultFactory = () => {
  const createSuccessResult = <T>(value: T) => Result.Ok(value);

  const createErrorResult = <E extends AppError>(error: E) =>
    Result.Err<unknown, E>(error);

  const createMixedResults = () => ({
    numberSuccess: createSuccessResult(42),
    stringSuccess: createSuccessResult("hello"),
    validationError: createErrorResult(
      new ValidationError(Str.fromRaw("Validation failed"))
    ),
    networkError: createErrorResult(
      new NetworkError(Str.fromRaw("Network error"))
    ),
  });

  const generateResultOperations = <T, E extends AppError>(
    result: Result<T, E>
  ) => ({
    map: <U>(fn: (value: T) => U) => result.map(fn),

    andThen: <U>(fn: (value: T) => Result<U, E>) => result.andThen(fn),

    mapErr: <F extends AppError>(fn: (error: E) => F) => result.mapErr(fn),
  });

  return {
    createSuccessResult,
    createErrorResult,
    createMixedResults,
    generateResultOperations,
  };
};

const useResultVerification = () => {
  const verifyResultState = <T, E extends AppError>(result: Result<T, E>) => ({
    isOk: () => expect(result.isOk()).toBe(true),

    isErr: () => expect(result.isErr()).toBe(true),

    unwrapsTo: (expectedValue: T) =>
      expect(result.unwrap()).toBe(expectedValue),

    errorIsInstanceOf: (errorType: new (...args: any[]) => E) =>
      expect(result.getError()).toBeInstanceOf(errorType),
  });

  const verifyResultTransformation = <T, U, E extends AppError>(
    original: Result<T, E>,
    transformed: Result<U, E>
  ) => ({
    transformationPreservesOkState: () =>
      expect(original.isOk()).toBe(transformed.isOk()),

    transformationPreservesErrState: () =>
      expect(original.isErr()).toBe(transformed.isErr()),
  });

  return {
    verifyResultState,
    verifyResultTransformation,
  };
};

describe("Result Advanced Transformations", () => {
  const {
    createSuccessResult,
    createErrorResult,
    createMixedResults,
    generateResultOperations,
  } = useResultFactory();

  const { verifyResultState, verifyResultTransformation } =
    useResultVerification();

  const { safeMultiply, safeConvert } = useResultHelpers();

  describe("Result Creation and Basic Operations", () => {
    it("creates Ok and Err results correctly", () => {
      const okResult = createSuccessResult(42);
      const errResult = createErrorResult(
        new ValidationError(Str.fromRaw("Error"))
      );

      const okState = verifyResultState(okResult);
      const errState = verifyResultState(errResult);

      okState.isOk();
      okState.unwrapsTo(42);

      errState.isErr();
      errState.errorIsInstanceOf(ValidationError);
    });
  });

  describe("Result Transformation Methods", () => {
    it("maps Ok results correctly", () => {
      const okResult = createSuccessResult(42);
      const resultOps = generateResultOperations(okResult);

      const mapped = resultOps.map(safeMultiply);
      const verifyTransform = verifyResultTransformation(okResult, mapped);

      verifyTransform.transformationPreservesOkState();
      verifyResultState(mapped).unwrapsTo(84);
    });

    it("maps Err results preserves error", () => {
      const { validationError } = createMixedResults();
      const resultOps = generateResultOperations(validationError);

      const mapped = resultOps.map(safeMultiply);
      const verifyTransform = verifyResultTransformation(
        validationError,
        mapped
      );

      verifyTransform.transformationPreservesOkState();
      verifyResultState(mapped).errorIsInstanceOf(ValidationError);
    });

    it("converts results to strings", () => {
      const okResult = createSuccessResult(42);
      const resultOps = generateResultOperations(okResult);

      const converted = resultOps.map(safeConvert);

      verifyResultState(converted).unwrapsTo("42");
    });
  });

  describe("Result Combination and Matching", () => {
    it("combines multiple Ok results", () => {
      const results = [
        createSuccessResult(1),
        createSuccessResult(2),
        createSuccessResult(3),
      ];

      const combinedResult = Result.all(results);

      verifyResultState(combinedResult).isOk();
      expect(combinedResult.unwrap()).toEqual([1, 2, 3]);
    });

    it("combines results with first error", () => {
      const { validationError } = createMixedResults();
      const results = [
        createSuccessResult(1),
        validationError,
        createSuccessResult(3),
      ];

      const combinedResult = Result.all(results);

      verifyResultState(combinedResult).isErr();
      verifyResultState(combinedResult).errorIsInstanceOf(ValidationError);
    });
  });
});
