import { ChangeEvent } from "react";
import {
  CommonOperationCategory,
  TypeCheckType,
  OptionOperation,
  ResultOperation,
  LoadingState,
  BrandType,
} from "./types";
import {
  FormGroup,
  Label,
  Input,
  Textarea,
  Select,
  InfoBox,
  SmallText,
} from "./Common.styles";

interface CommonInputFormProps {
  activeCategory: CommonOperationCategory;
  inputValue: string;
  setInputValue: (value: string) => void;
  secondValue: string;
  setSecondValue: (value: string) => void;
  defaultValue: string;
  setDefaultValue: (value: string) => void;
  arrayValues: string;
  setArrayValues: (value: string) => void;
  typeCheckType: TypeCheckType;
  setTypeCheckType: (type: TypeCheckType) => void;
  optionOperation: OptionOperation;
  setOptionOperation: (op: OptionOperation) => void;
  resultOperation: ResultOperation;
  setResultOperation: (op: ResultOperation) => void;
  loadingState: LoadingState;
  setLoadingState: (state: LoadingState) => void;
  brandType: BrandType;
  setBrandType: (type: BrandType) => void;
}

function CommonInputForm({
  activeCategory,
  inputValue,
  setInputValue,
  secondValue,
  setSecondValue,
  defaultValue,
  setDefaultValue,
  arrayValues,
  setArrayValues,
  typeCheckType,
  setTypeCheckType,
  optionOperation,
  setOptionOperation,
  resultOperation,
  setResultOperation,
  loadingState,
  setLoadingState,
  brandType,
  setBrandType,
}: CommonInputFormProps) {
  switch (activeCategory) {
    case "typeCheck":
      return (
        <>
          <FormGroup>
            <Label htmlFor="input-value">Value to check</Label>
            <Input
              id="input-value"
              type="text"
              value={inputValue}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setInputValue(e.target.value)
              }
              placeholder="Enter a value to check"
            />
            <SmallText>
              Can be a string, number, boolean, null, or a valid JSON
              object/array.
            </SmallText>
          </FormGroup>
          <FormGroup>
            <Label htmlFor="type-check-select">Type to check for</Label>
            <Select
              id="type-check-select"
              value={typeCheckType}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                setTypeCheckType(e.target.value as TypeCheckType)
              }
            >
              <option value="defined">Defined</option>
              <option value="object">Object</option>
              <option value="vec">Vec</option>
              <option value="str">String</option>
              <option value="numeric">Numeric</option>
              <option value="boolean">Boolean</option>
              <option value="function">Function</option>
            </Select>
          </FormGroup>
        </>
      );

    case "convertToVec":
      return (
        <>
          <FormGroup>
            <Label htmlFor="array-values">Values to convert to Vec</Label>
            <Textarea
              id="array-values"
              value={arrayValues}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                setArrayValues(e.target.value)
              }
              placeholder="[1, 2, 3, 'hello', true] or 1, 2, 3, hello, true"
            />
            <SmallText>
              Enter a JSON array or comma-separated values. Values will be
              converted to appropriate types where possible.
            </SmallText>
          </FormGroup>
        </>
      );

    case "loadingStates":
      return (
        <>
          <InfoBox>
            The MiLost library provides predefined loading states that can be
            used for tracking asynchronous operations.
          </InfoBox>
          <FormGroup>
            <Label htmlFor="loading-state-select">Choose a loading state</Label>
            <Select
              id="loading-state-select"
              value={loadingState}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                setLoadingState(e.target.value as LoadingState)
              }
            >
              <option value="IDLE">IDLE</option>
              <option value="LOADING">LOADING</option>
              <option value="SUCCEEDED">SUCCEEDED</option>
              <option value="FAILED">FAILED</option>
            </Select>
          </FormGroup>
        </>
      );

    case "brandTypes":
      return (
        <>
          <InfoBox>
            Brand types allow TypeScript to differentiate between values of the
            same primitive type but with different semantic meanings.
          </InfoBox>
          <FormGroup>
            <Label htmlFor="brand-type-select">Choose a brand type</Label>
            <Select
              id="brand-type-select"
              value={brandType}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                setBrandType(e.target.value as BrandType)
              }
            >
              <option value="JSON">JSON</option>
              <option value="POSITIVE">POSITIVE</option>
              <option value="NEGATIVE">NEGATIVE</option>
              <option value="NON_NEGATIVE">NON_NEGATIVE</option>
              <option value="PERCENTAGE">PERCENTAGE</option>
            </Select>
          </FormGroup>
        </>
      );

    case "option":
      return (
        <>
          <InfoBox>
            The Option type represents a value that may or may not be present,
            similar to Rust's Option or Haskell's Maybe.
          </InfoBox>
          <FormGroup>
            <Label htmlFor="option-operation-select">Option operation</Label>
            <Select
              id="option-operation-select"
              value={optionOperation}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                setOptionOperation(e.target.value as OptionOperation)
              }
            >
              <option value="some">Some (wrap a value)</option>
              <option value="none">None (empty option)</option>
              <option value="isSome">isSome (check if has value)</option>
              <option value="isNone">isNone (check if empty)</option>
              <option value="unwrap">unwrap (get value or error)</option>
              <option value="unwrapOr">unwrapOr (get value or default)</option>
            </Select>
          </FormGroup>

          {optionOperation !== "none" && (
            <FormGroup>
              <Label htmlFor="option-value">Value</Label>
              <Input
                id="option-value"
                type="text"
                value={inputValue}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setInputValue(e.target.value)
                }
                placeholder="Enter a value"
              />
            </FormGroup>
          )}

          {optionOperation === "unwrapOr" && (
            <FormGroup>
              <Label htmlFor="default-value">Default value (if None)</Label>
              <Input
                id="default-value"
                type="text"
                value={defaultValue}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setDefaultValue(e.target.value)
                }
                placeholder="Enter a default value"
              />
            </FormGroup>
          )}
        </>
      );

    case "result":
      return (
        <>
          <InfoBox>
            The Result type represents either success (Ok) or failure (Err),
            similar to Rust's Result type.
          </InfoBox>
          <FormGroup>
            <Label htmlFor="result-operation-select">Result operation</Label>
            <Select
              id="result-operation-select"
              value={resultOperation}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                setResultOperation(e.target.value as ResultOperation)
              }
            >
              <option value="ok">Ok (success)</option>
              <option value="err">Err (failure)</option>
              <option value="isOk">isOk (check if success)</option>
              <option value="isErr">isErr (check if failure)</option>
              <option value="unwrap">unwrap (get value or throw)</option>
              <option value="unwrapErr">unwrapErr (get error or throw)</option>
              <option value="unwrapOr">unwrapOr (get value or default)</option>
            </Select>
          </FormGroup>

          {(resultOperation === "ok" ||
            resultOperation === "unwrap" ||
            resultOperation === "unwrapOr" ||
            resultOperation === "isOk" ||
            resultOperation === "isErr") && (
            <FormGroup>
              <Label htmlFor="result-value">Success value</Label>
              <Input
                id="result-value"
                type="text"
                value={inputValue}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setInputValue(e.target.value)
                }
                placeholder="Enter a success value"
              />
            </FormGroup>
          )}

          {(resultOperation === "err" || resultOperation === "unwrapErr") && (
            <FormGroup>
              <Label htmlFor="error-value">Error value</Label>
              <Input
                id="error-value"
                type="text"
                value={secondValue}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setSecondValue(e.target.value)
                }
                placeholder="Enter an error value"
              />
            </FormGroup>
          )}

          {resultOperation === "unwrapOr" && (
            <FormGroup>
              <Label htmlFor="default-value">Default value (if Err)</Label>
              <Input
                id="default-value"
                type="text"
                value={defaultValue}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setDefaultValue(e.target.value)
                }
                placeholder="Enter a default value"
              />
            </FormGroup>
          )}
        </>
      );

    default:
      return null;
  }
}

export default CommonInputForm;
