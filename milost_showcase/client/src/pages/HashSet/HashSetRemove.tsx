import { ChangeEvent } from "react";
import {
  FormGroup,
  Label,
  Input,
  SmallText,
  ValuesList,
  ValueItem,
} from "./HashSet.styles";

interface HashSetRemoveProps {
  setValue: any[];
  valueInput: string;
  setValueInput: (value: string) => void;
}

function HashSetRemove({
  setValue,
  valueInput,
  setValueInput,
}: HashSetRemoveProps) {
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
        <Label htmlFor="remove-value-input">Value to remove</Label>
        <Input
          id="remove-value-input"
          type="text"
          value={valueInput}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setValueInput(e.target.value)
          }
          placeholder="Enter a value to remove"
        />
        <SmallText>
          For strings, just type the text. For numbers, booleans, or null, type
          the value directly.
        </SmallText>
      </FormGroup>
    </>
  );
}

export default HashSetRemove;
