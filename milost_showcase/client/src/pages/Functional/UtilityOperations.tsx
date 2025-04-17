import { ChangeEvent } from "react";
import {
  FormGroup,
  Label,
  FunctionInput,
  Textarea,
  FormRow,
  InputColumn,
  OperationGrid,
  OperationButton,
} from "./Functional.styles";
import { FunctionalUtilityOperation } from "./types";

interface UtilityOperationsProps {
  operation: FunctionalUtilityOperation;
  setOperation: (operation: FunctionalUtilityOperation) => void;
  functionCode: string;
  setFunctionCode: (value: string) => void;
  partialArgs: string;
  juxtFunctions: string;
  firstArray: string;
  secondArray: string;
  convergeAfter: string;
  setConvergeAfter: (value: string) => void;
  transformers: string;
  handlePartialArgsChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  handleJuxtFunctionsChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  handleFirstArrayChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  handleSecondArrayChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  handleTransformersChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}

function UtilityOperations({
  operation,
  setOperation,
  functionCode,
  setFunctionCode,
  partialArgs,
  juxtFunctions,
  firstArray,
  secondArray,
  convergeAfter,
  setConvergeAfter,
  transformers,
  handlePartialArgsChange,
  handleJuxtFunctionsChange,
  handleFirstArrayChange,
  handleSecondArrayChange,
  handleTransformersChange,
}: UtilityOperationsProps) {
  return (
    <>
      {operation === "partial" && (
        <>
          <FormGroup>
            <Label htmlFor="function-code">Function</Label>
            <FunctionInput
              id="function-code"
              value={functionCode}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                setFunctionCode(e.target.value)
              }
              placeholder="(a, b, c) => a + b + c"
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="partial-args">
              Partial Arguments (comma-separated or JSON array)
            </Label>
            <Textarea
              id="partial-args"
              value={partialArgs}
              onChange={handlePartialArgsChange}
              placeholder="[1, 2]"
            />
          </FormGroup>
        </>
      )}

      {operation === "flip" && (
        <FormGroup>
          <Label htmlFor="function-code">Function</Label>
          <FunctionInput
            id="function-code"
            value={functionCode}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              setFunctionCode(e.target.value)
            }
            placeholder="(a, b) => a / b"
          />
        </FormGroup>
      )}

      {operation === "juxt" && (
        <FormGroup>
          <Label htmlFor="juxt-functions">
            Enter functions array (in JSON format)
          </Label>
          <Textarea
            id="juxt-functions"
            value={juxtFunctions}
            onChange={handleJuxtFunctionsChange}
            placeholder="[(x) => x * 2, (x) => x + 1]"
          />
        </FormGroup>
      )}

      {operation === "zipWith" && (
        <>
          <FormGroup>
            <Label htmlFor="function-code">Combining Function</Label>
            <FunctionInput
              id="function-code"
              value={functionCode}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                setFunctionCode(e.target.value)
              }
              placeholder="(a, b) => a + b"
            />
          </FormGroup>
          <FormRow>
            <InputColumn>
              <Label htmlFor="first-array">First Array</Label>
              <Textarea
                id="first-array"
                value={firstArray}
                onChange={handleFirstArrayChange}
                placeholder="[1, 2, 3]"
              />
            </InputColumn>
            <InputColumn>
              <Label htmlFor="second-array">Second Array</Label>
              <Textarea
                id="second-array"
                value={secondArray}
                onChange={handleSecondArrayChange}
                placeholder="[4, 5, 6]"
              />
            </InputColumn>
          </FormRow>
        </>
      )}

      {operation === "converge" && (
        <>
          <FormGroup>
            <Label htmlFor="converge-after">After Function</Label>
            <FunctionInput
              id="converge-after"
              value={convergeAfter}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                setConvergeAfter(e.target.value)
              }
              placeholder="(x, y, z) => x + y + z"
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="transformers">
              Transformer Functions (in JSON format)
            </Label>
            <Textarea
              id="transformers"
              value={transformers}
              onChange={handleTransformersChange}
              placeholder="[(x) => x * 2, (x) => x + 1, (x) => x - 1]"
            />
          </FormGroup>
        </>
      )}

      <OperationGrid>
        <OperationButton
          active={operation === "partial"}
          onClick={() => setOperation("partial")}
        >
          partial
        </OperationButton>
        <OperationButton
          active={operation === "flip"}
          onClick={() => setOperation("flip")}
        >
          flip
        </OperationButton>
        <OperationButton
          active={operation === "juxt"}
          onClick={() => setOperation("juxt")}
        >
          juxt
        </OperationButton>
        <OperationButton
          active={operation === "zipWith"}
          onClick={() => setOperation("zipWith")}
        >
          zipWith
        </OperationButton>
        <OperationButton
          active={operation === "converge"}
          onClick={() => setOperation("converge")}
        >
          converge
        </OperationButton>
      </OperationGrid>
    </>
  );
}

export default UtilityOperations;
