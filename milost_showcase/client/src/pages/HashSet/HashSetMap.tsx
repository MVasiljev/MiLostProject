import { ChangeEvent } from "react";
import {
  FormGroup,
  Label,
  Select,
  SmallText,
  ValuesList,
  ValueItem,
} from "./HashSet.styles";
import { HashSetMapOperation } from "./types";

interface HashSetMapProps {
  setValue: any[];
  mapOperation: HashSetMapOperation;
  setMapOperation: (operation: HashSetMapOperation) => void;
}

function HashSetMap({
  setValue,
  mapOperation,
  setMapOperation,
}: HashSetMapProps) {
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
        <Label htmlFor="map-operation-select">Map operation</Label>
        <Select
          id="map-operation-select"
          value={mapOperation}
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            setMapOperation(e.target.value as HashSetMapOperation)
          }
        >
          <option value="double">Double numbers</option>
          <option value="square">Square numbers</option>
          <option value="toString">Convert all to strings</option>
          <option value="increment">Increment numbers</option>
          <option value="uppercase">Uppercase strings</option>
          <option value="lowercase">Lowercase strings</option>
        </Select>
        <SmallText>
          Operations only affect applicable values (e.g., "double" only affects
          numbers).
        </SmallText>
      </FormGroup>
    </>
  );
}

export default HashSetMap;
