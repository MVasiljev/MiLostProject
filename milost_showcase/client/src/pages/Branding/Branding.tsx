import React, { useState, ChangeEvent } from "react";
import {
  Container,
  Header,
  Title,
  Subtitle,
  Card,
  CardTitle,
  FormGroup,
  Label,
  Input,
  NumberInput,
  PrimaryButton,
  ErrorMessage,
  ResultContainer,
  ResultTitle,
  ResultContent,
  TabsContainer,
  Tab,
  OperationButton,
} from "../Strings/Strings.styles";

import {
  ValidatorConfigContainer,
  ValidatorTypeSelector,
  ResultPreview,
} from "./Branding.styles";

import {
  BrandingOperation,
  ValidatorType,
  BrandingOperationRequest,
  BrandingOperationResponse,
} from "./types";

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

function BrandingPage() {
  const [value, setValue] = useState<string>("");
  const [brand, setBrand] = useState<string>("");
  const [fromBrand, setFromBrand] = useState<string>("");
  const [toBrand, setToBrand] = useState<string>("");

  const [validatorType, setValidatorType] = useState<ValidatorType>("range");
  const [minValue, setMinValue] = useState<number>(0);
  const [maxValue, setMaxValue] = useState<number>(100);
  const [regexPattern, setRegexPattern] = useState<string>("");
  const [predefinedType, setPredefinedType] = useState<
    "positive" | "negative" | "non_negative"
  >("positive");

  const [activeOperation, setActiveOperation] =
    useState<BrandingOperation>("create");
  const [result, setResult] = useState<BrandingOperationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiBaseUrl = "/api";

  const handleBrandOperation = async (): Promise<void> => {
    setLoading(true);
    setError(null);

    const validator =
      validatorType === "range"
        ? {
            type: "range" as ValidatorType,
            config: { min: minValue, max: maxValue },
          }
        : validatorType === "regex"
          ? {
              type: "regex" as ValidatorType,
              config: { pattern: regexPattern },
            }
          : validatorType === "predefined"
            ? {
                type: "predefined" as ValidatorType,
                config: { predefinedType },
              }
            : undefined;

    const requestBody: BrandingOperationRequest = {
      value,
      brand: activeOperation === "convert" ? toBrand : brand,
      operation: activeOperation,
      validator,
    };

    if (activeOperation === "convert") {
      requestBody.fromBrand = fromBrand;
    }

    try {
      const response = await fetch(`${apiBaseUrl}/branded/operation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data: ApiResponse<BrandingOperationResponse> =
        await response.json();

      if (response.ok && data.data) {
        setResult(data.data);
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      setError("Failed to connect to API");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const renderValidatorConfig = () => {
    switch (validatorType) {
      case "range":
        return (
          <ValidatorConfigContainer>
            <FormGroup>
              <Label>Minimum Value</Label>
              <NumberInput
                type="number"
                value={minValue}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setMinValue(Number(e.target.value))
                }
              />
            </FormGroup>
            <FormGroup>
              <Label>Maximum Value</Label>
              <NumberInput
                type="number"
                value={maxValue}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setMaxValue(Number(e.target.value))
                }
              />
            </FormGroup>
          </ValidatorConfigContainer>
        );
      case "regex":
        return (
          <FormGroup>
            <Label>Regex Pattern</Label>
            <Input
              type="text"
              value={regexPattern}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setRegexPattern(e.target.value)
              }
              placeholder="Enter regex pattern (e.g., ^[A-Z]+$)"
            />
          </FormGroup>
        );
      case "predefined":
        return (
          <FormGroup>
            <Label>Predefined Type</Label>
            <select
              value={predefinedType}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                setPredefinedType(
                  e.target.value as "positive" | "negative" | "non_negative"
                )
              }
            >
              <option value="positive">Positive</option>
              <option value="negative">Negative</option>
              <option value="non_negative">Non-Negative</option>
            </select>
          </FormGroup>
        );
      default:
        return null;
    }
  };

  const renderOperationInputs = () => {
    switch (activeOperation) {
      case "create":
      case "validate":
      case "unwrap":
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
                placeholder="Enter value to brand"
              />
            </FormGroup>
            <FormGroup>
              <Label>Brand Name</Label>
              <Input
                type="text"
                value={brand}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setBrand(e.target.value)
                }
                placeholder="Enter brand name"
              />
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
                placeholder="Enter value to convert"
              />
            </FormGroup>
            <FormGroup>
              <Label>From Brand</Label>
              <Input
                type="text"
                value={fromBrand}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setFromBrand(e.target.value)
                }
                placeholder="Enter source brand"
              />
            </FormGroup>
            <FormGroup>
              <Label>To Brand</Label>
              <Input
                type="text"
                value={toBrand}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setToBrand(e.target.value)
                }
                placeholder="Enter target brand"
              />
            </FormGroup>
          </>
        );
    }
  };

  return (
    <Container>
      <Header>
        <Title>Branded Types</Title>
        <Subtitle>
          Create and manipulate type-safe branded values with runtime validation
        </Subtitle>
      </Header>

      <Card>
        <CardTitle>Branded Type Operations</CardTitle>

        <TabsContainer>
          {(
            ["create", "validate", "unwrap", "convert"] as BrandingOperation[]
          ).map((op) => (
            <Tab
              key={op}
              active={activeOperation === op}
              onClick={() => setActiveOperation(op)}
            >
              {op.charAt(0).toUpperCase() + op.slice(1)}
            </Tab>
          ))}
        </TabsContainer>

        {renderOperationInputs()}

        <ValidatorTypeSelector>
          {(["range", "regex", "predefined"] as ValidatorType[]).map((type) => (
            <OperationButton
              key={type}
              active={validatorType === type}
              onClick={() => setValidatorType(type)}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </OperationButton>
          ))}
        </ValidatorTypeSelector>

        {renderValidatorConfig()}

        <PrimaryButton onClick={handleBrandOperation} disabled={loading}>
          {loading ? "Processing..." : "Execute Operation"}
        </PrimaryButton>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        {result && (
          <ResultContainer>
            <ResultTitle>Result</ResultTitle>
            <ResultContent>
              <ResultPreview>{JSON.stringify(result, null, 2)}</ResultPreview>
            </ResultContent>
          </ResultContainer>
        )}
      </Card>

      <Card>
        <CardTitle>Branded Types Examples</CardTitle>
        <ResultPreview>
          {`import { Branded, BrandTypes } from "milost";

// Validate positive numbers
const Percentage = Branded.create(
  75, 
  BrandTypes.PERCENTAGE, 
  (val) => val >= 0 && val <= 100
);

// Custom branded type
const Age = Branded.create(
  25, 
  Str.fromRaw("AdultAge"), 
  (val) => val >= 18
);

// Convert between brands
const price = Branded.create(
  100, 
  BrandTypes.POSITIVE, 
  (val) => val > 0
);

const convertedPrice = price
  .map((p) => p * 1.1)  // Apply tax
  .replace(BrandTypes.NON_NEGATIVE);`}
        </ResultPreview>
      </Card>
    </Container>
  );
}

export default BrandingPage;
