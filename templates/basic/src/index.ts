import { Vec } from "./milost/types/vec";
import { Str } from "./milost/types/string";
import { Result } from "./milost/core/result";
import { Option } from "./milost/core/option";

// Example MiLost code
const myVec = Vec.from([1, 2, 3, 4, 5]);
const greeting = Str.fromRaw("Hello, MiLost!");

console.log(greeting.unwrap());
console.log(`Vector length: ${myVec.len()}`);

// Demonstrate Option usage
const maybeValue = Option.Some(42);
maybeValue.match(
  (value: number) => console.log(`Got value: ${value}`),
  () => console.log("No value present")
);

// Demonstrate Result usage
function divide(a: number, b: number): Result<number, Error> {
  if (b === 0) {
    return Result.Err(new Error("Division by zero"));
  }
  return Result.Ok(a / b);
}

divide(10, 2).match(
  (result: number) => console.log(`Result: ${result}`),
  (error: Error) => console.log(`Error: ${error.message}`)
);
