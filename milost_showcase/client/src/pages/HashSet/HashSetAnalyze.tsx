import { ChangeEvent } from "react";
import {
  FormGroup,
  Label,
  Textarea,
  Select,
  SmallText,
  ValuesList,
  ValueItem,
  InfoBox,
} from "./HashSet.styles";
import { HashSetSetOperation } from "./types";

interface HashSetSetOperationProps {
  setValue: any[];
  secondSetInput: string;
  setSecondSetInput: (input: string) => void;
  setOperation: HashSetSetOperation;
  setSetOperation: (operation: HashSetSetOperation) => void;
}

function HashSetSetOperationComponent({
  setValue,
  secondSetInput,
  setSecondSetInput,
  setOperation,
  setSetOperation,
}: HashSetSetOperationProps) {
  return (
    <>
      <InfoBox>
        Set operations work on two HashSets and produce a new HashSet or boolean
        result.
      </InfoBox>
      <FormGroup>
        <Label>First HashSet</Label>
        <ValuesList>
          {setValue.map((val, index) => (
            <ValueItem key={index}>{String(val)}</ValueItem>
          ))}
        </ValuesList>
      </FormGroup>
      <FormGroup>
        <Label htmlFor="second-set-input">
          Second HashSet (comma-separated values)
        </Label>
        <Textarea
          id="second-set-input"
          value={secondSetInput}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
            setSecondSetInput(e.target.value)
          }
          placeholder="e.g. 3, 4, 5, 'world'"
        />
      </FormGroup>
      <FormGroup>
        <Label htmlFor="set-operation-select">Set Operation</Label>
        <Select
          id="set-operation-select"
          value={setOperation}
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            setSetOperation(e.target.value as HashSetSetOperation)
          }
        >
          <option value="union">Union (A ∪ B)</option>
          <option value="intersection">Intersection (A ∩ B)</option>
          <option value="difference">Difference (A - B)</option>
          <option value="symmetricDifference">
            Symmetric Difference (A △ B)
          </option>
          <option value="isSubset">Is Subset (A ⊆ B)</option>
          <option value="isSuperset">Is Superset (A ⊇ B)</option>
        </Select>
        <SmallText>
          Choose a set operation to perform between the first and second
          HashSets.
        </SmallText>
      </FormGroup>
    </>
  );
}

export default HashSetSetOperationComponent;
