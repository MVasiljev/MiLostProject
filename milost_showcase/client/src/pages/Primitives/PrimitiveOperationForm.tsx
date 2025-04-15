import { ChangeEvent } from "react";
import {
  CardTitle,
  FormGroup,
  Label,
  Input,
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
} from "./types";

interface PrimitiveOperationFormProps {
  activeCategory: PrimitiveOperationCategory;
  value: string;
  setValue: (value: string) => void;
  secondValue: string;
  setSecondValue: (value: string) => void;
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
  precision: string;
  setPrecision: (precision: string) => void;
  handleSubmit: () => void;
  loading: boolean;
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
  handleSubmit,
  loading,
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

  const renderInputs = () => {
    switch (activeCategory) {
      case "create":
        return (
          <>
            <FormGroup>
              <Label htmlFor="value-input">Value</Label>
              <Input
                id="value-input"
                type="text"
                value={value}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setValue(e.target.value)
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
                type="text"
                value={value}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setValue(e.target.value)
                }
                placeholder="First value"
              />
            </FormGroup>
            <FormGroup>
              <Label>Second Value</Label>
              <Input
                type="text"
                value={secondValue}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setSecondValue(e.target.value)
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
                type="text"
                value={value}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setValue(e.target.value)
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
                  type="text"
                  value={secondValue}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setSecondValue(e.target.value)
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
                type="text"
                value={value}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setValue(e.target.value)
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
                <Input
                  type="text"
                  value={precision}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setPrecision(e.target.value)
                  }
                  placeholder="Decimal places"
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
                type="text"
                value={value}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setValue(e.target.value)
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
                type="text"
                value={value}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setValue(e.target.value)
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
                type="text"
                value={value}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setValue(e.target.value)
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
    <>
      <CardTitle>
        {activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)}{" "}
        Operation
      </CardTitle>

      {renderInputs()}

      <PrimaryButton onClick={handleSubmit} disabled={loading}>
        {loading ? "Processing..." : "Execute Operation"}
      </PrimaryButton>
    </>
  );
}

export default PrimitiveOperationForm;
