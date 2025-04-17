import { ChangeEvent } from "react";
import {
  FormGroup,
  Label,
  Textarea,
  ObjectPreview,
  InfoNote,
  FunctionInput,
  NumberInput,
  OperationGrid,
  OperationButton,
} from "./Functional.styles";
import { FunctionalTransformOperation } from "./types";

interface TransformOperationsProps {
  operation: FunctionalTransformOperation;
  setOperation: (operation: FunctionalTransformOperation) => void;
  objectInput: string;
  parsedObject: Record<string, any>;
  pipeFunctions: string;
  functionCode: string;
  setFunctionCode: (value: string) => void;
  arity: number;
  setArity: (value: number) => void;
  handleObjectInputChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  handlePipeFunctionsChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}

function TransformOperations({
  operation,
  setOperation,
  objectInput,
  parsedObject,
  pipeFunctions,
  functionCode,
  setFunctionCode,
  arity,
  setArity,
  handleObjectInputChange,
  handlePipeFunctionsChange,
}: TransformOperationsProps) {
  return (
    <>
      {operation === "mergeDeep" && (
        <FormGroup>
          <Label htmlFor="object-input">
            Enter object to merge (in JSON format)
          </Label>
          <Textarea
            id="object-input"
            value={objectInput}
            onChange={handleObjectInputChange}
            placeholder='{ "a": 1, "b": 2, "c": 3 }'
          />
          {Object.keys(parsedObject).length > 0 && (
            <ObjectPreview>
              {JSON.stringify(parsedObject, null, 2)}
            </ObjectPreview>
          )}
          <InfoNote>
            Note: For demonstration purposes, we'll merge this object with a
            copy of itself. In a real application, you would merge multiple
            different objects.
          </InfoNote>
        </FormGroup>
      )}

      {(operation === "pipe" || operation === "compose") && (
        <FormGroup>
          <Label htmlFor="pipe-functions">
            Enter functions array (in JSON format)
          </Label>
          <Textarea
            id="pipe-functions"
            value={pipeFunctions}
            onChange={handlePipeFunctionsChange}
            placeholder="[(x) => x * 2, (x) => x + 1]"
          />
        </FormGroup>
      )}

      {operation === "curry" && (
        <>
          <FormGroup>
            <Label htmlFor="function-code">Function to curry</Label>
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
            <Label htmlFor="arity">Arity (optional)</Label>
            <NumberInput
              id="arity"
              type="number"
              value={arity}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setArity(parseInt(e.target.value) || 2)
              }
              min={1}
            />
          </FormGroup>
        </>
      )}

      {(operation === "memoize" || operation === "once") && (
        <FormGroup>
          <Label htmlFor="function-code">Function</Label>
          <FunctionInput
            id="function-code"
            value={functionCode}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              setFunctionCode(e.target.value)
            }
            placeholder={
              operation === "memoize"
                ? "(x) => { console.log('computing'); return x * 2; }"
                : "(x) => { console.log('setup done'); }"
            }
          />
        </FormGroup>
      )}

      <OperationGrid>
        <OperationButton
          active={operation === "mergeDeep"}
          onClick={() => setOperation("mergeDeep")}
        >
          mergeDeep
        </OperationButton>
        <OperationButton
          active={operation === "pipe"}
          onClick={() => setOperation("pipe")}
        >
          pipe
        </OperationButton>
        <OperationButton
          active={operation === "compose"}
          onClick={() => setOperation("compose")}
        >
          compose
        </OperationButton>
        <OperationButton
          active={operation === "curry"}
          onClick={() => setOperation("curry")}
        >
          curry
        </OperationButton>
        <OperationButton
          active={operation === "memoize"}
          onClick={() => setOperation("memoize")}
        >
          memoize
        </OperationButton>
        <OperationButton
          active={operation === "once"}
          onClick={() => setOperation("once")}
        >
          once
        </OperationButton>
      </OperationGrid>
    </>
  );
}

export default TransformOperations;
