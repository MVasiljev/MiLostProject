import { Card, CardTitle, CodeBlock, Pre, SmallText } from "./Common.styles";

function CommonExamples() {
  return (
    <Card>
      <CardTitle>Common Utilities API Examples</CardTitle>
      <CodeBlock>
        <Pre>
          {`import { 
    isDefined, isObject, isVec, isStr, isNumeric, isBoolean, isFunction,
    iterableToVec,
    Option, Result,
    LoadingStates, BrandTypes
  } from "milost";
  
  // ---- Type Checking ----
  console.log(isDefined(null));        // true (null is defined)
  console.log(isDefined(undefined));   // false
  console.log(isNumeric(42));          // true
  console.log(isNumeric("42"));        // false (strict type checking)
  console.log(isVec([]));              // false (regular array, not Vec)
  
  // ---- Convert to Vec ----
  const regularArray = [1, 2, 3, "hello", true];
  const vec = iterableToVec(regularArray);
  console.log(vec.len());              // 5
  
  // ---- Loading States ----
  console.log(LoadingStates.IDLE);        // "idle"
  console.log(LoadingStates.LOADING);     // "loading"
  console.log(LoadingStates.SUCCEEDED);   // "succeeded"
  console.log(LoadingStates.FAILED);      // "failed"
  
  // ---- Brand Types ----
  console.log(BrandTypes.JSON);           // "json"
  console.log(BrandTypes.POSITIVE);       // "positive"
  
  // ---- Option Type ----
  // Create an Option with a value
  const some = Option.Some(42);
  console.log(some.isSome());          // true
  console.log(some.isNone());          // false
  console.log(some.unwrap());          // 42
  
  // Create an empty Option
  const none = Option.None();
  console.log(none.isSome());          // false
  console.log(none.isNone());          // true
  console.log(none.unwrapOr(0));       // 0 (default value)
  
  // ---- Result Type ----
  // Create a success Result
  const ok = Result.Ok("success");
  console.log(ok.isOk());              // true
  console.log(ok.isErr());             // false
  console.log(ok.unwrap());            // "success"
  
  // Create a failure Result
  const err = Result.Err("failure");
  console.log(err.isOk());             // false
  console.log(err.isErr());            // true
  console.log(err.unwrapOr("default")); // "default"
  console.log(err.unwrapErr());        // "failure"`}
        </Pre>
      </CodeBlock>
    </Card>
  );
}

export default CommonExamples;
