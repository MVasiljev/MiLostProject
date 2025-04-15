import React, { useState } from "react";
import {
  PrimitiveType,
  ArithmeticOperation,
  BitwiseOperation,
  FormatOperation,
  BitManipulationOperation,
  PrimitiveOperationCategory,
  PrimitiveOperationResult,
} from "./types";

import { Container, Header, Title, Subtitle, Card } from "./Primitives.styles";

import PrimitiveOperationTabs from "./PrimitiveOperationTabs";
import PrimitiveOperationForm from "./PrimitiveOperationForm";
import PrimitiveResultRenderer from "./PrimitiveResultRenderer";
import PrimitiveExamples from "./PrimitiveExamples";

function PrimitivesPage() {
  // State for input values and configuration
  const [value, setValue] = useState<string>("0");
  const [secondValue, setSecondValue] = useState<string>("0");
  const [primitiveType, setPrimitiveType] = useState<PrimitiveType>("u32");
  const [fromType, setFromType] = useState<PrimitiveType>("u32");
  const [toType, setToType] = useState<PrimitiveType>("u32");

  // Operation states
  const [activeCategory, setActiveCategory] =
    useState<PrimitiveOperationCategory>("create");

  // Specific operation states
  const [arithmeticOperation, setArithmeticOperation] =
    useState<ArithmeticOperation>("add");
  const [bitwiseOperation, setBitwiseOperation] =
    useState<BitwiseOperation>("and");
  const [formatOperation, setFormatOperation] =
    useState<FormatOperation>("bin");
  const [bitManipulationOperation, setBitManipulationOperation] =
    useState<BitManipulationOperation>("isPowerOfTwo");
  const [precision, setPrecision] = useState<string>("2");

  // Result and error handling
  const [result, setResult] = useState<PrimitiveOperationResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const apiBaseUrl = "/api";

  // Handle form submission
  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      let endpoint = `${apiBaseUrl}/primitive`;
      let requestBody: any = {};

      // Parse string inputs to numbers when needed
      const numValue = value.trim() === "" ? 0 : Number(value);
      const numSecondValue =
        secondValue.trim() === "" ? 0 : Number(secondValue);
      const numPrecision = precision.trim() === "" ? 0 : Number(precision);

      switch (activeCategory) {
        case "create":
          endpoint += "";
          requestBody = { value: numValue, type: primitiveType };
          break;
        case "arithmetic":
          endpoint += "/arithmetic";
          requestBody = {
            a: numValue,
            b: numSecondValue,
            operation: arithmeticOperation,
            type: primitiveType,
          };
          break;
        case "bitwise":
          endpoint += "/bitwise";
          requestBody = {
            a: numValue,
            operation: bitwiseOperation,
          };
          if (
            ["and", "or", "xor", "shift_left", "shift_right"].includes(
              bitwiseOperation
            )
          ) {
            requestBody.b = numSecondValue;
          }
          break;
        case "format":
          endpoint += "/format";
          requestBody = {
            value: numValue,
            format: formatOperation,
          };
          if (formatOperation === "float") {
            requestBody.precision = numPrecision;
          }
          break;
        case "bitManipulation":
          endpoint += "/bit-manipulation";
          requestBody = {
            value: numValue,
            operation: bitManipulationOperation,
          };
          break;
        case "validate":
          endpoint += "/validate";
          requestBody = { value: numValue, type: primitiveType };
          break;
        case "convert":
          endpoint += "/convert";
          requestBody = {
            value: numValue,
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

  return (
    <Container>
      <Header>
        <Title>Primitive Type Operations</Title>
        <Subtitle>
          Perform various operations on primitive types with WebAssembly
          acceleration
        </Subtitle>
      </Header>

      <PrimitiveOperationTabs
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />

      <Card>
        <PrimitiveOperationForm
          activeCategory={activeCategory}
          value={value}
          setValue={setValue}
          secondValue={secondValue}
          setSecondValue={setSecondValue}
          primitiveType={primitiveType}
          setPrimitiveType={setPrimitiveType}
          fromType={fromType}
          setFromType={setFromType}
          toType={toType}
          setToType={setToType}
          arithmeticOperation={arithmeticOperation}
          setArithmeticOperation={setArithmeticOperation}
          bitwiseOperation={bitwiseOperation}
          setBitwiseOperation={setBitwiseOperation}
          formatOperation={formatOperation}
          setFormatOperation={setFormatOperation}
          bitManipulationOperation={bitManipulationOperation}
          setBitManipulationOperation={setBitManipulationOperation}
          precision={precision}
          setPrecision={setPrecision}
          handleSubmit={handleSubmit}
          loading={loading}
        />

        <PrimitiveResultRenderer
          loading={loading}
          error={error}
          result={result}
        />
      </Card>

      <PrimitiveExamples />
    </Container>
  );
}

export default PrimitivesPage;
