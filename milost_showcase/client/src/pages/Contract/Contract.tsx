import { useState } from "react";
import {
  Container,
  Header,
  Title,
  Subtitle,
  Card,
  CardTitle,
  TabsContainer,
  Tab,
  InfoBox,
  FormGroup,
  Label,
  CodeBlock,
  Pre,
  SmallText,
} from "./Contract.styles";
import { Table } from "../Vector/Vector.styles";

function ContractPage() {
  const [activeCategory, setActiveCategory] = useState("overview");

  const categories = [
    { id: "overview", label: "Overview" },
    { id: "preconditions", label: "Preconditions" },
    { id: "postconditions", label: "Postconditions" },
    { id: "invariants", label: "Invariants" },
    { id: "advanced", label: "Advanced Techniques" },
    { id: "examples", label: "Examples" },
  ];

  return (
    <Container>
      <Header>
        <Title>Design by Contract</Title>
        <Subtitle>
          Compile-Time Guarantees for Robust and Reliable Code
        </Subtitle>
      </Header>

      <TabsContainer>
        {categories.map((category) => (
          <Tab
            key={category.id}
            active={activeCategory === category.id}
            onClick={() => setActiveCategory(category.id)}
          >
            {category.label}
          </Tab>
        ))}
      </TabsContainer>

      <Card>
        <CardTitle>
          {activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)}
        </CardTitle>

        {activeCategory === "overview" && (
          <>
            <InfoBox>
              Design by Contract is a software design approach that uses formal,
              precise and verifiable interface specifications for software
              components.
            </InfoBox>

            <FormGroup>
              <Label>What is Design by Contract?</Label>
              <p>
                Design by Contract (DbC) is a methodology that treats the
                specifications of software components as a contract, with
                well-defined obligations and benefits for both the consumer and
                the provider of a service.
              </p>
            </FormGroup>

            <FormGroup>
              <Label>Core Concepts</Label>
              <Table>
                <thead>
                  <tr>
                    <th>Concept</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Preconditions</td>
                    <td>
                      Conditions that must be true before a method executes
                    </td>
                  </tr>
                  <tr>
                    <td>Postconditions</td>
                    <td>
                      Conditions that must be true after a method executes
                    </td>
                  </tr>
                  <tr>
                    <td>Invariants</td>
                    <td>
                      Conditions that must remain true throughout an object's
                      lifecycle
                    </td>
                  </tr>
                </tbody>
              </Table>
            </FormGroup>

            <CodeBlock>
              <Pre>{`import { requires, ensures, contract } from "milost";

// Traditional Approach
function divide(a, b) {
  if (b === 0) {
    throw new Error("Cannot divide by zero");
  }
  return a / b;
}

// Contract Approach
function safeDivide(a, b) {
  // Precondition: b must not be zero
  requires(b !== 0, "Cannot divide by zero");
  
  // Postcondition: result must be a number
  return ensures(
    result => typeof result === 'number',
    a / b
  );
}`}</Pre>
            </CodeBlock>

            <SmallText>
              Design by Contract transforms runtime errors into compile-time
              guarantees, making code more robust and self-documenting.
            </SmallText>
          </>
        )}

        {activeCategory === "preconditions" && (
          <>
            <InfoBox>
              Preconditions define the valid input conditions for a method,
              ensuring that functions are called with appropriate arguments.
            </InfoBox>

            <FormGroup>
              <Label>Precondition Characteristics</Label>
              <Table>
                <thead>
                  <tr>
                    <th>Characteristic</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Input Validation</td>
                    <td>Ensure inputs meet specific criteria</td>
                  </tr>
                  <tr>
                    <td>Early Error Detection</td>
                    <td>Catch invalid inputs before processing</td>
                  </tr>
                  <tr>
                    <td>Self-Documenting</td>
                    <td>Conditions serve as inline documentation</td>
                  </tr>
                </tbody>
              </Table>
            </FormGroup>

            <CodeBlock>
              <Pre>{`import { requires } from "milost";

function processUserData(user) {
  // Precondition: Validate user object structure
  requires(user !== null, "User cannot be null");
  requires(
    user.age !== undefined && user.age >= 0, 
    "User must have a non-negative age"
  );

  // Method implementation
  return calculateUserScore(user);
}

// Another example with complex validation
function createProduct(name, price) {
  // Multiple precondition checks
  requires(name.length > 0, "Product name must not be empty");
  requires(
    price > 0, 
    "Price must be a positive number"
  );

  // Create and return product
  return {
    name,
    price,
    id: generateProductId()
  };
}`}</Pre>
            </CodeBlock>

            <SmallText>
              Preconditions provide a robust mechanism for validating method
              inputs before execution.
            </SmallText>
          </>
        )}

        {activeCategory === "postconditions" && (
          <>
            <InfoBox>
              Postconditions verify the expected state or return value after a
              method completes its execution.
            </InfoBox>

            <FormGroup>
              <Label>Postcondition Techniques</Label>
              <Table>
                <thead>
                  <tr>
                    <th>Technique</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Result Validation</td>
                    <td>Verify return value meets specific criteria</td>
                  </tr>
                  <tr>
                    <td>State Verification</td>
                    <td>Confirm expected state after method execution</td>
                  </tr>
                  <tr>
                    <td>Transformation Checks</td>
                    <td>Validate expected transformations occurred</td>
                  </tr>
                </tbody>
              </Table>
            </FormGroup>

            <CodeBlock>
              <Pre>{`import { ensures } from "milost";

function calculateDiscount(price, percentage) {
  // Precondition
  requires(price > 0, "Price must be positive");
  requires(
    percentage >= 0 && percentage <= 100, 
    "Discount percentage must be between 0 and 100"
  );

  // Calculate discounted price
  const discountedPrice = price * (1 - percentage / 100);

  // Postcondition: Ensure discount was applied correctly
  return ensures(
    result => {
      // Verify the result meets expected conditions
      return result < price && 
             result >= 0 && 
             Math.abs(result - (price * (1 - percentage / 100))) < 0.001;
    },
    discountedPrice
  );
}

// Complex postcondition example
function processUserTransactions(transactions) {
  const processedTransactions = transactions.map(processTransaction);

  // Postcondition: Validate processed results
  ensures(
    results => {
      // Ensure no transactions were lost
      return results.length === transactions.length &&
             results.every(t => t.status === 'processed');
    },
    processedTransactions
  );

  return processedTransactions;
}`}</Pre>
            </CodeBlock>

            <SmallText>
              Postconditions ensure that methods produce the expected results,
              adding an extra layer of verification.
            </SmallText>
          </>
        )}

        {activeCategory === "invariants" && (
          <>
            <InfoBox>
              Invariants define conditions that must remain true throughout an
              object's lifecycle, ensuring consistent internal state.
            </InfoBox>

            <FormGroup>
              <Label>Invariant Characteristics</Label>
              <Table>
                <thead>
                  <tr>
                    <th>Characteristic</th>
                    <th>Description</th>
                    <th>Benefit</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>State Validation</td>
                    <td>Enforce consistent object state</td>
                    <td>Prevent invalid state transitions</td>
                  </tr>
                  <tr>
                    <td>Compile-Time Checks</td>
                    <td>Validate conditions at object creation</td>
                    <td>Catch errors early in development</td>
                  </tr>
                  <tr>
                    <td>Transformation Safety</td>
                    <td>Ensure modifications respect core constraints</td>
                    <td>Maintain object integrity</td>
                  </tr>
                </tbody>
              </Table>
            </FormGroup>

            <CodeBlock>
              <Pre>{`import { Invariant } from "milost";

// Bank Account with Invariant
class BankAccount {
  constructor(initialBalance) {
    // Invariant: Balance must always be non-negative
    this.balance = Invariant.new(
      initialBalance, 
      balance => balance >= 0,
      "Account balance cannot be negative"
    );
  }

  deposit(amount) {
    // Ensure deposit maintains the invariant
    this.balance = this.balance.set(
      currentBalance => currentBalance + amount,
      newBalance => newBalance >= 0
    );
  }

  withdraw(amount) {
      // Ensure withdrawal maintains the invariant
      this.balance = this.balance.set(
        currentBalance => currentBalance - amount,
        newBalance => newBalance >= 0
      );
    }
  }

  // Complex Invariant Example
  class TemperatureMonitor {
    constructor(initialTemp) {
      // Invariant: Temperature within realistic range
      this.temperature = Invariant.new(
        initialTemp,
        temp => temp >= -273.15 && temp <= 1000000,
        "Temperature outside of physically possible range"
      );
    }

    updateTemperature(newTemp) {
      // Transformations must respect the invariant
      this.temperature = this.temperature.map(
        currentTemp => newTemp,
        newTemp => newTemp >= -273.15 && newTemp <= 1000000
      );
    }
  }
}`}</Pre>
            </CodeBlock>

            <SmallText>
              Invariants provide a powerful mechanism for maintaining object
              consistency and preventing invalid state changes.
            </SmallText>
          </>
        )}

        {activeCategory === "advanced" && (
          <>
            <InfoBox>
              Advanced contract programming techniques combine multiple contract
              elements for comprehensive validation.
            </InfoBox>

            <FormGroup>
              <Label>Advanced Contract Techniques</Label>
              <Table>
                <thead>
                  <tr>
                    <th>Technique</th>
                    <th>Description</th>
                    <th>Use Case</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Comprehensive Validation</td>
                    <td>Combine pre and post conditions</td>
                    <td>Complex data processing</td>
                  </tr>
                  <tr>
                    <td>Functional Contracts</td>
                    <td>Wrap functions with validation logic</td>
                    <td>Secure data transformations</td>
                  </tr>
                  <tr>
                    <td>Dynamic Constraints</td>
                    <td>Create context-aware validation</td>
                    <td>Adaptive system constraints</td>
                  </tr>
                </tbody>
              </Table>
            </FormGroup>

            <CodeBlock>
              <Pre>{`import { contract, requires, ensures } from "milost";

// Comprehensive Contract Example
const processOrder = contract(
// Original function
(order) => {
// Core processing logic
return calculateOrderTotal(order);
},
// Precondition
(order) => 
order.items.length > 0 && 
order.customer !== null,
// Postcondition
(order, result) => 
result > 0 && 
result <= calculateMaxPossibleTotal(order),
// Optional error messages
"Order must have items and a customer",
"Total must be positive and within expected range"
);

// Composing Multiple Contracts
const secureDataProcessor = contract(
// Core data processing function
(sensitiveData) => {
return anonymizeData(sensitiveData);
},
// Input validation
(data) => data !== null && data.length > 0,
// Output validation
(input, output) => 
output.length === input.length && 
!output.some(item => containsPersonalInfo(item)),
"Input cannot be null or empty",
"Output must preserve structure and remove personal information"
);`}</Pre>
            </CodeBlock>

            <SmallText>
              Advanced contract techniques provide flexible, powerful mechanisms
              for ensuring code correctness and safety.
            </SmallText>
          </>
        )}

        {activeCategory === "examples" && (
          <>
            <InfoBox>
              Real-world scenarios demonstrating the power of design by contract
              principles.
            </InfoBox>

            <FormGroup>
              <Label>Example Scenarios</Label>
              <Table>
                <thead>
                  <tr>
                    <th>Domain</th>
                    <th>Contract Technique</th>
                    <th>Key Benefit</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Financial Trading</td>
                    <td>Invariants and Contracted Methods</td>
                    <td>Prevent invalid financial transactions</td>
                  </tr>
                  <tr>
                    <td>User Data Validation</td>
                    <td>Preconditions and Postconditions</td>
                    <td>Ensure data consistency and format</td>
                  </tr>
                </tbody>
              </Table>
            </FormGroup>

            <CodeBlock>
              <Pre>{`import { 
requires, 
ensures, 
contract, 
Invariant 
} from "milost";

// Financial Trading System Example
class TradingAccount {
constructor(initialBalance) {
// Invariant: Maintain positive balance
this.balance = Invariant.new(
initialBalance,
balance => balance >= 0,
"Account balance must remain non-negative"
);
}

// Contracted trade method
trade = contract(
(stockSymbol, quantity, price) => {
// Actual trading logic
const totalCost = quantity * price;
this.balance = this.balance.set(
current => current - totalCost,
newBalance => newBalance >= 0
);
return executeTrade(stockSymbol, quantity);
},
// Preconditions
(symbol, qty, price) => 
qty > 0 && 
price > 0 && 
symbol.length > 0,
// Postconditions
(symbol, qty, price, result) => 
result.status === 'executed' && 
result.quantity === qty,
"Invalid trade parameters",
"Trade execution failed"
);
}

// Data Validation Microservice
function validateUserData(userData) {
// Comprehensive data validation
requires(userData.email.includes('@'), "Invalid email format");
requires(userData.age >= 18, "User must be at least 18");

// Transform and validate
const processedData = ensures(
result => 
result.email === userData.email.toLowerCase() &&
result.age === Math.floor(userData.age),
{
...userData,
email: userData.email.toLowerCase(),
age: Math.floor(userData.age)
}
);

return processedData;
}`}</Pre>
            </CodeBlock>

            <SmallText>
              These examples demonstrate how design by contract principles can
              be applied to create more robust and self-documenting code.
            </SmallText>
          </>
        )}
      </Card>
    </Container>
  );
}

export default ContractPage;
