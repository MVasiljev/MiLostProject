// // example/src/app.ts

// import { initWasm } from "../../lib/wasm/init";
// import { Option, Some, None } from "../../lib/core/option";
// import { Result, Ok, Err } from "../../lib/core/result";
// import { Vec } from "../../lib/types/vec";
// import { Str } from "../../lib/types/string";

// /**
//  * Initialize the example application
//  */
// export async function initializeExample() {
//   console.log("Initializing MiLost example...");

//   // Initialize the WASM module
//   const wasmModule = await initWasm();
//   console.log("WASM module initialized:", wasmModule);

//   // Examples using our TypeScript library with WASM integration
//   demonstrateOptionType();
//   demonstrateResultType();
//   demonstrateVecType();
//   await demonstrateStrType(wasmModule);

//   console.log("MiLost example initialized successfully!");
// }

// function demonstrateOptionType() {
//   console.log("--- Option Type Demo ---");

//   const someValue: Option<number> = Some(42);
//   console.log("Some value:", someValue.unwrapOr(0));

//   const noneValue: Option<number> = None();
//   console.log("None value with default:", noneValue.unwrapOr(0));

//   // Using map
//   const mappedSome = someValue.map((x) => x * 2);
//   console.log("Mapped Some:", mappedSome.unwrapOr(0));
// }

// function demonstrateResultType() {
//   console.log("--- Result Type Demo ---");

//   const okResult: Result<number, string> = Ok(42);
//   console.log("Ok result:", okResult.unwrapOr(0));

//   const errResult: Result<number, string> = Err("Something went wrong");
//   console.log("Err result with default:", errResult.unwrapOr(0));
//   console.log("Err message:", errResult.unwrapErr());
// }

// function demonstrateVecType() {
//   console.log("--- Vec Type Demo ---");

//   const numbers = new Vec<number>([1, 2, 3, 4, 5]);
//   console.log("Vec length:", numbers.len());
//   console.log("Vec values:", numbers.toArray());

//   numbers.push(6);
//   console.log("Vec after push:", numbers.toArray());

//   const popped = numbers.pop();
//   console.log("Popped value:", popped.unwrapOr(0));
//   console.log("Vec after pop:", numbers.toArray());
// }

// async function demonstrateStrType(wasmModule: any) {
//   console.log("--- Str Type Demo ---");

//   // Create a new Str from JavaScript string using WASM
//   const wasmStr = new wasmModule.Str("Hello from WASM!");
//   console.log("WASM Str created:", wasmStr.toString());

//   // Use our TypeScript wrapper for Str
//   const str = new Str("Hello, MiLost!");
//   console.log("TS Str length:", str.len());
//   console.log("TS Str as string:", str.toString());

//   // Demonstrate methods
//   console.log('Str contains "MiLost":', str.contains("MiLost"));
//   console.log("Str to uppercase:", str.toUpperCase().toString());

//   return "Str type demo completed";
// }
