import { ChangeEvent } from "react";
import {
  FormGroup,
  Label,
  Input,
  SmallText,
  ValuesList,
  ValueItem,
} from "./HashSet.styles";

interface HashSetContainsProps {
  setValue: any[];
  valueInput: string;
  setValueInput: (value: string) => void;
}

function HashSetContains({
  setValue,
  valueInput,
  setValueInput,
}: HashSetContainsProps) {
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
        <Label htmlFor="value-input">Value to check</Label>
        <Input
          id="value-input"
          type="text"
          value={valueInput}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setValueInput(e.target.value)
          }
          placeholder="Enter a value to check"
        />
        <SmallText>
          For strings, just type the text. For numbers, booleans, or null, type
          the value directly.
        </SmallText>
      </FormGroup>
    </>
  );
}

export default HashSetContains;
