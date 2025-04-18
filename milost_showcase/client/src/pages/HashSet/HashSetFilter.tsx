import { ChangeEvent } from "react";
import {
  FormGroup,
  Label,
  Input,
  Select,
  ValuesList,
  ValueItem,
} from "./HashSet.styles";
import { HashSetFilterOperation } from "./types";

interface HashSetFilterProps {
  setValue: any[];
  filterOperation: HashSetFilterOperation;
  setFilterOperation: (operation: HashSetFilterOperation) => void;
  filterParameter: string;
  setFilterParameter: (parameter: string) => void;
}

function HashSetFilter({
  setValue,
  filterOperation,
  setFilterOperation,
  filterParameter,
  setFilterParameter,
}: HashSetFilterProps) {
  return (
    <>
      <FormGroup>
        <Label>Current HashSet</Label>
        <ValuesList>
          {setValue.map((val, index) => (
            <ValueItem key={index}>{String(val)}</ValueItem>
          ))}
        </ValuesList>
      </FormGroup>
      <FormGroup>
        <Label htmlFor="filter-operation-select">Filter operation</Label>
        <Select
          id="filter-operation-select"
          value={filterOperation}
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            setFilterOperation(e.target.value as HashSetFilterOperation)
          }
        >
          <option value="greaterThan">Greater than (numbers)</option>
          <option value="lessThan">Less than (numbers)</option>
          <option value="equals">Equals (any type)</option>
          <option value="contains">Contains (strings)</option>
          <option value="startsWith">Starts with (strings)</option>
          <option value="endsWith">Ends with (strings)</option>
        </Select>
      </FormGroup>
      {(filterOperation === "greaterThan" ||
        filterOperation === "lessThan" ||
        filterOperation === "equals" ||
        filterOperation === "contains" ||
        filterOperation === "startsWith" ||
        filterOperation === "endsWith") && (
        <FormGroup>
          <Label htmlFor="filter-parameter-input">Parameter</Label>
          <Input
            id="filter-parameter-input"
            type="text"
            value={filterParameter}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setFilterParameter(e.target.value)
            }
            placeholder="Enter parameter value"
          />
        </FormGroup>
      )}
    </>
  );
}

export default HashSetFilter;
