import { ChangeEvent } from "react";
import {
  FormGroup,
  Label,
  Input,
  SmallText,
  ValuesList,
  ValueItem,
} from "./HashSet.styles";

interface HashSetInsertProps {
  setValue: any[];
  valueInput: string;
  setValueInput: (value: string) => void;
}

function HashSetInsert({
  setValue,
  valueInput,
  setValueInput,
}: HashSetInsertProps) {
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
        <Label htmlFor="insert-value-input">Value to insert</Label>
        <Input
          id="insert-value-input"
          type="text"
          value={valueInput}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setValueInput(e.target.value)
          }
          placeholder="Enter a value to insert"
        />
        <SmallText>
          For strings, just type the text. For numbers, booleans, or null, type
          the value directly.
        </SmallText>
      </FormGroup>
    </>
  );
}

export default HashSetInsert;
