import { ChangeEvent } from "react";
import { FormGroup, Label, Textarea, SmallText } from "./HashSet.styles";

interface HashSetAnalyzeProps {
  inputValue: string;
  setInputValue: (value: string) => void;
}

function HashSetAnalyze({ inputValue, setInputValue }: HashSetAnalyzeProps) {
  return (
    <>
      <FormGroup>
        <Label htmlFor="hashset-input">
          Enter HashSet values (comma-separated)
        </Label>
        <Textarea
          id="hashset-input"
          value={inputValue}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
            setInputValue(e.target.value)
          }
          placeholder="e.g. 1, 2, 3, 'hello', true"
        />
        <SmallText>
          Supported formats: numbers, booleans (true/false), strings ('text' or
          "text"), null values, and arrays
        </SmallText>
      </FormGroup>
    </>
  );
}

export default HashSetAnalyze;
