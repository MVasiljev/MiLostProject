import { ChangeEvent } from "react";
import {
  FormGroup,
  Label,
  FunctionInput,
  NumberInput,
  Textarea,
  OperationGrid,
  OperationButton,
} from "./Functional.styles";
import { FunctionalExecutionOperation } from "./types";

interface ExecutionOperationsProps {
  operation: FunctionalExecutionOperation;
  setOperation: (operation: FunctionalExecutionOperation) => void;
  functionCode: string;
  setFunctionCode: (value: string) => void;
  waitTime: number;
  setWaitTime: (value: number) => void;
  inputValues: string;
  handleInputValuesChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}

function ExecutionOperations({
  operation,
  setOperation,
  functionCode,
  setFunctionCode,
  waitTime,
  setWaitTime,
  inputValues,
  handleInputValuesChange,
}: ExecutionOperationsProps) {
  return (
    <>
      {(operation === "throttle" || operation === "debounce") && (
        <>
          <FormGroup>
            <Label htmlFor="function-code">Function</Label>
            <FunctionInput
              id="function-code"
              value={functionCode}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                setFunctionCode(e.target.value)
              }
              placeholder="(x) => console.log(x)"
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="wait-time">Wait Time (ms)</Label>
            <NumberInput
              id="wait-time"
              type="number"
              value={waitTime}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setWaitTime(parseInt(e.target.value) || 300)
              }
              min={0}
            />
          </FormGroup>
        </>
      )}

      {operation === "identity" && (
        <FormGroup>
          <Label htmlFor="array-input">Enter value</Label>
          <Textarea
            id="array-input"
            value={inputValues}
            onChange={handleInputValuesChange}
            placeholder="Any value"
          />
        </FormGroup>
      )}

      <OperationGrid>
        <OperationButton
          active={operation === "throttle"}
          onClick={() => setOperation("throttle")}
        >
          throttle
        </OperationButton>
        <OperationButton
          active={operation === "debounce"}
          onClick={() => setOperation("debounce")}
        >
          debounce
        </OperationButton>
        <OperationButton
          active={operation === "noop"}
          onClick={() => setOperation("noop")}
        >
          noop
        </OperationButton>
        <OperationButton
          active={operation === "identity"}
          onClick={() => setOperation("identity")}
        >
          identity
        </OperationButton>
      </OperationGrid>
    </>
  );
}

export default ExecutionOperations;
