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
  value: string;
  setValue: (value: string) => void;
}

function HashSetInsert({
  setValue,
  value,
  setValue: setValueFn,
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
          value={value}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setValueFn(e.target.value)
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
