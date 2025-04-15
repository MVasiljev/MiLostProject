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

import { Container, Header, Title, Subtitle } from "./Primitives.styles";

import PrimitiveOperationTabs from "./PrimitiveOperationTabs";
import PrimitiveOperationForm from "./PrimitiveOperationForm";
import PrimitiveResultRenderer from "./PrimitiveResultRenderer";
import PrimitiveExamples from "./PrimitiveExamples";

function PrimitivesPage() {
  // State for input values and configuration
  const [value, setValue] = useState<number>(0);
  const [secondValue, setSecondValue] = useState<number>(0);
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
  const [precision, setPrecision] = useState<number>(2);

  // Result and error handling
  const [result, setResult] = useState<PrimitiveOperationResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const apiBaseUrl = "/api";

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
        apiBaseUrl={apiBaseUrl}
        setResult={setResult}
        setLoading={setLoading}
        setError={setError}
      />

      {(loading || error || result) && (
        <PrimitiveResultRenderer
          loading={loading}
          error={error}
          result={result}
        />
      )}

      <PrimitiveExamples />
    </Container>
  );
}

export default PrimitivesPage;
