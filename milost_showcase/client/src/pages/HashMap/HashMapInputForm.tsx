import { ChangeEvent } from "react";
import {
  FormGroup,
  Label,
  Textarea,
  SmallText,
  Input,
  InputRow,
  InputColumn,
  Select,
} from "./HashMap.styles";
import {
  HashMapOperationCategory,
  HashMapMapOperation,
  HashMapFilterOperation,
} from "./types";

interface HashMapInputFormProps {
  activeCategory: HashMapOperationCategory;
  hashMapEntries: Array<[string, any]>;
  inputValue: string;
  setInputValue: (value: string) => void;
  key: string;
  setKey: (key: string) => void;
  newValue: string;
  setNewValue: (value: string) => void;
  parameterValue: string;
  setParameterValue: (value: string) => void;
  mapOperation: HashMapMapOperation;
  setMapOperation: (operation: HashMapMapOperation) => void;
  filterOperation: HashMapFilterOperation;
  setFilterOperation: (operation: HashMapFilterOperation) => void;
}

const HashMapInputForm: React.FC<HashMapInputFormProps> = ({
  activeCategory,
  hashMapEntries,
  inputValue,
  setInputValue,
  key,
  setKey,
  newValue,
  setNewValue,
  parameterValue,
  setParameterValue,
  mapOperation,
  setMapOperation,
  filterOperation,
  setFilterOperation,
}) => {
  const renderForm = () => {
    switch (activeCategory) {
      case "analyze":
        return (
          <FormGroup>
            <Label htmlFor="hashmap-input">
              Enter a JSON object or key-value pairs
            </Label>
            <Textarea
              id="hashmap-input"
              value={inputValue}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                setInputValue(e.target.value)
              }
              placeholder='{ "key": "value" }'
            />
            <SmallText>
              Enter a valid JSON object or key-value pairs to create a HashMap.
              Examples: <br />- Object format: {"{"}
              "name": "John", "age": 30{"}"}
              <br />- Key-value pairs: name:John, age:30
            </SmallText>
          </FormGroup>
        );
      case "get":
      case "contains":
        return (
          <>
            <FormGroup>
              <Label htmlFor="hashmap-display">Current hash map</Label>
              <Textarea
                id="hashmap-display"
                value={JSON.stringify(
                  Object.fromEntries(hashMapEntries),
                  null,
                  2
                )}
                readOnly
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="key-input">
                Key to {activeCategory === "get" ? "get" : "check"}
              </Label>
              <Input
                id="key-input"
                type="text"
                value={key}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setKey(e.target.value)
                }
                placeholder="Enter key"
              />
            </FormGroup>
          </>
        );
      case "set":
        return (
          <>
            <FormGroup>
              <Label htmlFor="hashmap-display">Current hash map</Label>
              <Textarea
                id="hashmap-display"
                value={JSON.stringify(
                  Object.fromEntries(hashMapEntries),
                  null,
                  2
                )}
                readOnly
              />
            </FormGroup>
            <InputRow>
              <InputColumn>
                <Label htmlFor="key-input">Key</Label>
                <Input
                  id="key-input"
                  type="text"
                  value={key}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setKey(e.target.value)
                  }
                  placeholder="Enter key"
                />
              </InputColumn>
              <InputColumn>
                <Label htmlFor="value-input">New value</Label>
                <Input
                  id="value-input"
                  type="text"
                  value={newValue}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setNewValue(e.target.value)
                  }
                  placeholder="Enter new value"
                />
              </InputColumn>
            </InputRow>
            <SmallText>
              For strings, just type the text. For numbers, booleans, or null,
              type the value directly (e.g., true, 42, null).
            </SmallText>
          </>
        );
      case "remove":
        return (
          <>
            <FormGroup>
              <Label htmlFor="hashmap-display">Current hash map</Label>
              <Textarea
                id="hashmap-display"
                value={JSON.stringify(
                  Object.fromEntries(hashMapEntries),
                  null,
                  2
                )}
                readOnly
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="key-input">Key to remove</Label>
              <Input
                id="key-input"
                type="text"
                value={key}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setKey(e.target.value)
                }
                placeholder="Enter key to remove"
              />
            </FormGroup>
          </>
        );
      case "keys":
      case "values":
      case "entries":
        return (
          <FormGroup>
            <Label htmlFor="hashmap-display">Current hash map</Label>
            <Textarea
              id="hashmap-display"
              value={JSON.stringify(
                Object.fromEntries(hashMapEntries),
                null,
                2
              )}
              readOnly
            />
          </FormGroup>
        );
      case "map":
        return (
          <>
            <FormGroup>
              <Label htmlFor="hashmap-display">Current hash map</Label>
              <Textarea
                id="hashmap-display"
                value={JSON.stringify(
                  Object.fromEntries(hashMapEntries),
                  null,
                  2
                )}
                readOnly
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="map-operation">Map operation</Label>
              <Select
                id="map-operation"
                value={mapOperation}
                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                  setMapOperation(e.target.value as HashMapMapOperation)
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
                Operations only affect applicable values (e.g., "double" only
                affects numbers).
              </SmallText>
            </FormGroup>
          </>
        );
      case "filter":
        return (
          <>
            <FormGroup>
              <Label htmlFor="hashmap-display">Current hash map</Label>
              <Textarea
                id="hashmap-display"
                value={JSON.stringify(
                  Object.fromEntries(hashMapEntries),
                  null,
                  2
                )}
                readOnly
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="filter-operation">Filter operation</Label>
              <Select
                id="filter-operation"
                value={filterOperation}
                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                  setFilterOperation(e.target.value as HashMapFilterOperation)
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
            <FormGroup>
              <Label htmlFor="parameter-input">Parameter value</Label>
              <Input
                id="parameter-input"
                type="text"
                value={parameterValue}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setParameterValue(e.target.value)
                }
                placeholder="Enter parameter value"
              />
              <SmallText>
                For numerical operations, enter a number. For string operations,
                enter the text to search for.
              </SmallText>
            </FormGroup>
          </>
        );
      default:
        return <div>Please select an operation</div>;
    }
  };

  return renderForm();
};

export default HashMapInputForm;
