import { ChangeEvent } from "react";
import {
  FormGroup,
  Label,
  FunctionInput,
  Textarea,
  Input,
  OperationGrid,
  OperationButton,
} from "./Functional.styles";
import { FunctionalPredicateOperation } from "./types";

interface PredicateOperationsProps {
  operation: FunctionalPredicateOperation;
  setOperation: (operation: FunctionalPredicateOperation) => void;
  functionCode: string;
  setFunctionCode: (value: string) => void;
  predicates: string;
  propKey: string;
  setPropKey: (value: string) => void;
  propValue: string;
  setPropValue: (value: string) => void;
  handlePredicatesChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}

function PredicateOperations({
  operation,
  setOperation,
  functionCode,
  setFunctionCode,
  predicates,
  propKey,
  setPropKey,
  propValue,
  setPropValue,
  handlePredicatesChange,
}: PredicateOperationsProps) {
  return (
    <>
      {operation === "not" && (
        <FormGroup>
          <Label htmlFor="function-code">Predicate Function</Label>
          <FunctionInput
            id="function-code"
            value={functionCode}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              setFunctionCode(e.target.value)
            }
            placeholder="(x) => x > 2"
          />
        </FormGroup>
      )}

      {(operation === "allOf" || operation === "anyOf") && (
        <FormGroup>
          <Label htmlFor="predicates">
            Enter predicates array (in JSON format)
          </Label>
          <Textarea
            id="predicates"
            value={predicates}
            onChange={handlePredicatesChange}
            placeholder="[(x) => x > 2, (x) => x < 10]"
          />
        </FormGroup>
      )}

      {(operation === "prop" || operation === "hasProp") && (
        <FormGroup>
          <Label htmlFor="prop-key">Property Key</Label>
          <Input
            id="prop-key"
            type="text"
            value={propKey}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setPropKey(e.target.value)
            }
            placeholder="name"
          />
        </FormGroup>
      )}

      {operation === "propEq" && (
        <>
          <FormGroup>
            <Label htmlFor="prop-key">Property Key</Label>
            <Input
              id="prop-key"
              type="text"
              value={propKey}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setPropKey(e.target.value)
              }
              placeholder="name"
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="prop-value">Property Value</Label>
            <Input
              id="prop-value"
              type="text"
              value={propValue}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setPropValue(e.target.value)
              }
              placeholder="John"
            />
          </FormGroup>
        </>
      )}

      <OperationGrid>
        <OperationButton
          active={operation === "not"}
          onClick={() => setOperation("not")}
        >
          not
        </OperationButton>
        <OperationButton
          active={operation === "allOf"}
          onClick={() => setOperation("allOf")}
        >
          allOf
        </OperationButton>
        <OperationButton
          active={operation === "anyOf"}
          onClick={() => setOperation("anyOf")}
        >
          anyOf
        </OperationButton>
        <OperationButton
          active={operation === "prop"}
          onClick={() => setOperation("prop")}
        >
          prop
        </OperationButton>
        <OperationButton
          active={operation === "hasProp"}
          onClick={() => setOperation("hasProp")}
        >
          hasProp
        </OperationButton>
        <OperationButton
          active={operation === "propEq"}
          onClick={() => setOperation("propEq")}
        >
          propEq
        </OperationButton>
      </OperationGrid>
    </>
  );
}

export default PredicateOperations;
