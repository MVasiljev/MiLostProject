import { ChangeEvent } from "react";
import {
  Card,
  CardTitle,
  FormGroup,
  Label,
  Input,
  NumberInput,
  Select,
  PrimaryButton,
  InfoBox,
} from "./Primitives.styles";

import {
  PrimitiveType,
  ArithmeticOperation,
  BitwiseOperation,
  FormatOperation,
  BitManipulationOperation,
  PrimitiveOperationCategory,
  PrimitiveOperationResult,
} from "./types";

interface PrimitiveOperationFormProps {
  activeCategory: PrimitiveOperationCategory;
  value: number;
  setValue: (value: number) => void;
  secondValue: number;
  setSecondValue: (value: number) => void;
  primitiveType: PrimitiveType;
  setPrimitiveType: (type: PrimitiveType) => void;
  fromType: PrimitiveType;
  setFromType: (type: PrimitiveType) => void;
  toType: PrimitiveType;
  setToType: (type: PrimitiveType) => void;
  arithmeticOperation: ArithmeticOperation;
  setArithmeticOperation: (op: ArithmeticOperation) => void;
  bitwiseOperation: BitwiseOperation;
  setBitwiseOperation: (op: BitwiseOperation) => void;
  formatOperation: FormatOperation;
  setFormatOperation: (op: FormatOperation) => void;
  bitManipulationOperation: BitManipulationOperation;
  setBitManipulationOperation: (op: BitManipulationOperation) => void;
  precision: number;
  setPrecision: (precision: number) => void;
  apiBaseUrl: string;
  setResult: (result: PrimitiveOperationResult | null) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

function PrimitiveOperationForm({
  activeCategory,
  value,
  setValue,
  secondValue,
  setSecondValue,
  primitiveType,
  setPrimitiveType,
  fromType,
  setFromType,
  toType,
  setToType,
  arithmeticOperation,
  setArithmeticOperation,
  bitwiseOperation,
  setBitwiseOperation,
  formatOperation,
  setFormatOperation,
  bitManipulationOperation,
  setBitManipulationOperation,
  precision,
  setPrecision,
  apiBaseUrl,
  setResult,
  loading,
  setLoading,
  setError,
}: PrimitiveOperationFormProps) {
  const primitiveTypes: PrimitiveType[] = [
    "u8",
    "u16",
    "u32",
    "u64",
    "i8",
    "i16",
    "i32",
    "i64",
    "f32",
    "f64",
  ];

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      let endpoint = `${apiBaseUrl}/primitive`;
      let requestBody: any = {};

      switch (activeCategory) {
        case "create":
          endpoint += "";
          requestBody = { value, type: primitiveType };
          break;
        case "arithmetic":
          endpoint += "/arithmetic";
          requestBody = {
            a: value,
            b: secondValue,
            operation: arithmeticOperation,
            type: primitiveType,
          };
          break;
        case "bitwise":
          endpoint += "/bitwise";
          requestBody = {
            a: value,
            operation: bitwiseOperation,
          };
          if (
            ["and", "or", "xor", "shift_left", "shift_right"].includes(
              bitwiseOperation
            )
          ) {
            requestBody.b = secondValue;
          }
          break;
        case "format":
          endpoint += "/format";
          requestBody = {
            value,
            format: formatOperation,
          };
          if (formatOperation === "float") {
            requestBody.precision = precision;
          }
          break;
        case "bitManipulation":
          endpoint += "/bit-manipulation";
          requestBody = {
            value,
            operation: bitManipulationOperation,
          };
          break;
        case "validate":
          endpoint += "/validate";
          requestBody = { value, type: primitiveType };
          break;
        case "convert":
          endpoint += "/convert";
          requestBody = {
            value,
            fromType,
            toType,
          };
          break;
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (response.ok && data.data) {
        setResult(data.data);
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to perform operation"
      );
    } finally {
      setLoading(false);
    }
  };

  const renderInputs = () => {
    switch (activeCategory) {
      case "create":
        return (
          <>
            <FormGroup>
              <Label htmlFor="value-input">Value</Label>
              <Input
                id="value-input"
                type="number"
                value={value}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setValue(Number(e.target.value))
                }
                placeholder="Enter a value"
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="type-select">Primitive Type</Label>
              <Select
                id="type-select"
                value={primitiveType}
                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                  setPrimitiveType(e.target.value as PrimitiveType)
                }
              >
                {primitiveTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </Select>
            </FormGroup>
          </>
        );

      case "arithmetic":
        return (
          <>
            <FormGroup>
              <Label>First Value</Label>
              <Input
                type="number"
                value={value}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setValue(Number(e.target.value))
                }
                placeholder="First value"
              />
            </FormGroup>
            <FormGroup>
              <Label>Second Value</Label>
              <Input
                type="number"
                value={secondValue}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setSecondValue(Number(e.target.value))
                }
                placeholder="Second value"
              />
            </FormGroup>
            <FormGroup>
              <Label>Operation</Label>
              <Select
                value={arithmeticOperation}
                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                  setArithmeticOperation(e.target.value as ArithmeticOperation)
                }
              >
                <option value="add">Add</option>
                <option value="subtract">Subtract</option>
                <option value="multiply">Multiply</option>
                <option value="divide">Divide</option>
              </Select>
            </FormGroup>
            <FormGroup>
              <Label>Type</Label>
              <Select
                value={primitiveType}
                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                  setPrimitiveType(e.target.value as PrimitiveType)
                }
              >
                <option value="u8">u8</option>
                <option value="u16">u16</option>
                <option value="u32">u32</option>
              </Select>
            </FormGroup>
          </>
        );

      case "bitwise":
        return (
          <>
            <FormGroup>
              <Label>First Value</Label>
              <Input
                type="number"
                value={value}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setValue(Number(e.target.value))
                }
                placeholder="First value"
              />
            </FormGroup>
            {["and", "or", "xor", "shift_left", "shift_right"].includes(
              bitwiseOperation
            ) && (
              <FormGroup>
                <Label>Second Value</Label>
                <Input
                  type="number"
                  value={secondValue}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setSecondValue(Number(e.target.value))
                  }
                  placeholder="Second value"
                />
              </FormGroup>
            )}
            <FormGroup>
              <Label>Operation</Label>
              <Select
                value={bitwiseOperation}
                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                  setBitwiseOperation(e.target.value as BitwiseOperation)
                }
              >
                <option value="and">AND</option>
                <option value="or">OR</option>
                <option value="xor">XOR</option>
                <option value="not">NOT</option>
                <option value="shift_left">Shift Left</option>
                <option value="shift_right">Shift Right</option>
              </Select>
            </FormGroup>
          </>
        );

      case "format":
        return (
          <>
            <FormGroup>
              <Label>Value</Label>
              <Input
                type="number"
                value={value}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setValue(Number(e.target.value))
                }
                placeholder="Enter value"
              />
            </FormGroup>
            <FormGroup>
              <Label>Format</Label>
              <Select
                value={formatOperation}
                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                  setFormatOperation(e.target.value as FormatOperation)
                }
              >
                <option value="bin">Binary</option>
                <option value="hex">Hexadecimal</option>
                <option value="oct">Octal</option>
                <option value="float">Float</option>
              </Select>
            </FormGroup>
            {formatOperation === "float" && (
              <FormGroup>
                <Label>Precision</Label>
                <NumberInput
                  type="number"
                  value={precision}
                  min={0}
                  max={10}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setPrecision(
                      Math.max(0, Math.min(10, Number(e.target.value)))
                    )
                  }
                />
              </FormGroup>
            )}
          </>
        );

      case "bitManipulation":
        return (
          <>
            <FormGroup>
              <Label>Value</Label>
              <Input
                type="number"
                value={value}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setValue(Number(e.target.value))
                }
                placeholder="Enter value"
              />
            </FormGroup>
            <FormGroup>
              <Label>Operation</Label>
              <Select
                value={bitManipulationOperation}
                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                  setBitManipulationOperation(
                    e.target.value as BitManipulationOperation
                  )
                }
              >
                <option value="isPowerOfTwo">Is Power of Two</option>
                <option value="nextPowerOfTwo">Next Power of Two</option>
                <option value="leadingZeros">Leading Zeros</option>
                <option value="trailingZeros">Trailing Zeros</option>
                <option value="countOnes">Count Ones</option>
              </Select>
            </FormGroup>
            <InfoBox>
              Bit manipulation operations work on 32-bit unsigned integers.
            </InfoBox>
          </>
        );

      case "validate":
        return (
          <>
            <FormGroup>
              <Label>Value</Label>
              <Input
                type="number"
                value={value}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setValue(Number(e.target.value))
                }
                placeholder="Enter value"
              />
            </FormGroup>
            <FormGroup>
              <Label>Primitive Type</Label>
              <Select
                value={primitiveType}
                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                  setPrimitiveType(e.target.value as PrimitiveType)
                }
              >
                {primitiveTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </Select>
            </FormGroup>
          </>
        );

      case "convert":
        return (
          <>
            <FormGroup>
              <Label>Value</Label>
              <Input
                type="number"
                value={value}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setValue(Number(e.target.value))
                }
                placeholder="Enter value"
              />
            </FormGroup>
            <FormGroup>
              <Label>From Type</Label>
              <Select
                value={fromType}
                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                  setFromType(e.target.value as PrimitiveType)
                }
              >
                {primitiveTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </Select>
            </FormGroup>
            <FormGroup>
              <Label>To Type</Label>
              <Select
                value={toType}
                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                  setToType(e.target.value as PrimitiveType)
                }
              >
                {primitiveTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </Select>
            </FormGroup>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <Card>
      <CardTitle>
        {activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)}{" "}
        Operation
      </CardTitle>

      {renderInputs()}

      <PrimaryButton onClick={handleSubmit} disabled={loading}>
        Execute Operation
      </PrimaryButton>
    </Card>
  );
}

export default PrimitiveOperationForm;
