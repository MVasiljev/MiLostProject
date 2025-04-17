import { ChangeEvent } from "react";
import {
  FormGroup,
  Label,
  Textarea,
  ArrayPreview,
  FunctionInput,
  ObjectPreview,
  OperationGrid,
  OperationButton,
} from "./Functional.styles";
import { FunctionalMapOperation } from "./types";

interface MapOperationsProps {
  operation: FunctionalMapOperation;
  setOperation: (operation: FunctionalMapOperation) => void;
  inputValues: string;
  setInputValues: (value: string) => void;
  parsedValues: any[];
  objectInput: string;
  setObjectInput: (value: string) => void;
  parsedObject: Record<string, any>;
  keyFunction: string;
  setKeyFunction: (value: string) => void;
  mapFunction: string;
  setMapFunction: (value: string) => void;
  filterPredicate: string;
  setFilterPredicate: (value: string) => void;
  handleInputValuesChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  handleObjectInputChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}

function MapOperations({
  operation,
  setOperation,
  inputValues,
  setInputValues,
  parsedValues,
  objectInput,
  setObjectInput,
  parsedObject,
  keyFunction,
  setKeyFunction,
  mapFunction,
  setMapFunction,
  filterPredicate,
  setFilterPredicate,
  handleInputValuesChange,
  handleObjectInputChange,
}: MapOperationsProps) {
  return (
    <>
      {(operation === "toHashMap" ||
        operation === "toHashSet" ||
        operation === "toVec") && (
        <FormGroup>
          <Label htmlFor="array-input">
            Enter array values (comma-separated)
          </Label>
          <Textarea
            id="array-input"
            value={inputValues}
            onChange={handleInputValuesChange}
            placeholder="1, 2, 3, 4, 5"
          />
          {parsedValues.length > 0 && (
            <ArrayPreview>Parsed: [{parsedValues.join(", ")}]</ArrayPreview>
          )}
        </FormGroup>
      )}

      {operation === "toHashMap" && (
        <FormGroup>
          <Label htmlFor="key-function">Key Function</Label>
          <FunctionInput
            id="key-function"
            value={keyFunction}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              setKeyFunction(e.target.value)
            }
            placeholder="(x) => x.id"
          />
        </FormGroup>
      )}

      {(operation === "mapObject" || operation === "filterObject") && (
        <>
          <FormGroup>
            <Label htmlFor="object-input">Enter object (in JSON format)</Label>
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
          </FormGroup>

          {operation === "mapObject" && (
            <FormGroup>
              <Label htmlFor="map-function">Map Function</Label>
              <FunctionInput
                id="map-function"
                value={mapFunction}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                  setMapFunction(e.target.value)
                }
                placeholder="([key, value]) => [key, value * 2]"
              />
            </FormGroup>
          )}

          {operation === "filterObject" && (
            <FormGroup>
              <Label htmlFor="filter-predicate">Filter Predicate</Label>
              <FunctionInput
                id="filter-predicate"
                value={filterPredicate}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                  setFilterPredicate(e.target.value)
                }
                placeholder="([key, value]) => value > 2"
              />
            </FormGroup>
          )}
        </>
      )}

      <OperationGrid>
        <OperationButton
          active={operation === "toHashMap"}
          onClick={() => setOperation("toHashMap")}
        >
          toHashMap
        </OperationButton>
        <OperationButton
          active={operation === "toHashSet"}
          onClick={() => setOperation("toHashSet")}
        >
          toHashSet
        </OperationButton>
        <OperationButton
          active={operation === "toVec"}
          onClick={() => setOperation("toVec")}
        >
          toVec
        </OperationButton>
        <OperationButton
          active={operation === "mapObject"}
          onClick={() => setOperation("mapObject")}
        >
          mapObject
        </OperationButton>
        <OperationButton
          active={operation === "filterObject"}
          onClick={() => setOperation("filterObject")}
        >
          filterObject
        </OperationButton>
      </OperationGrid>
    </>
  );
}

export default MapOperations;
