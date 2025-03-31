// src/app.ts
import { Option, Some, None } from "../../lib/core/option";
import { Result, Ok, Err } from "../../lib/core/result";
import { Vec } from "../../lib/types/vec";
import { Str } from "../../lib/types/string";

// Output element for logging
const output = document.getElementById("output");

// Helper function to log output
function log(message: string, isError = false, isSuccess = false): void {
  console.log(message);
  if (!output) return;

  const p = document.createElement("p");
  p.textContent = message;
  if (isError) p.className = "error";
  if (isSuccess) p.className = "success";
  output.appendChild(p);
}

/**
 * Initialize the example application
 * This function is exported and called from the HTML file
 */
export async function initializeExample(): Promise<void> {
  log("Initializing MiLost example...");

  // WASM is already initialized in the HTML file
  if (!window.wasmReady || !window.wasmModule) {
    log("WASM module not initialized properly", true);
    return;
  }

  log("WASM module initialized successfully", false, true);

  // Examples using our TypeScript library with WASM integration
  demonstrateOptionType();
  demonstrateResultType();
  demonstrateVecType();
  await demonstrateStrType();

  log("MiLost example initialized successfully!", false, true);
}

function demonstrateOptionType(): void {
  log("--- Option Type Demo ---");
  const someValue: Option<number> = Some(42);
  log(`Some value: ${someValue.unwrapOr(0)}`);

  const noneValue: Option<number> = None();
  log(`None value with default: ${noneValue.unwrapOr(0)}`);

  // Using map
  const mappedSome = someValue.map((x) => x * 2);
  log(`Mapped Some: ${mappedSome.unwrapOr(0)}`);
}

function demonstrateResultType(): void {
  log("--- Result Type Demo ---");
  const okResult: Result<number, string> = Ok(42);
  log(`Ok result: ${okResult.unwrapOr(0)}`);

  const errResult: Result<number, string> = Err("Something went wrong");
  log(`Err result with default: ${errResult.unwrapOr(0)}`);
  log(`Err message: ${errResult.unwrapErr()}`);
}

function demonstrateVecType(): void {
  log("--- Vec Type Demo ---");
  const numbers = new Vec<number>([1, 2, 3, 4, 5]);
  log(`Vec length: ${numbers.len()}`);
  log(`Vec values: ${numbers.toArray()}`);

  numbers.push(6);
  log(`Vec after push: ${numbers.toArray()}`);

  const popped = numbers.pop();
  log(`Popped value: ${popped.unwrapOr(0)}`);
  log(`Vec after pop: ${numbers.toArray()}`);
}

async function demonstrateStrType(): Promise<string> {
  log("--- Str Type Demo ---");

  // Use the WASM module from the global window object
  const wasmModule = window.wasmModule;

  // Create a new Str from JavaScript string using WASM
  const wasmStr = new wasmModule.Str("Hello from WASM!");
  log(`WASM Str created: ${wasmStr.unwrap()}`);

  // Use our TypeScript wrapper for Str
  const str = new Str("Hello, MiLost!");
  log(`TS Str length: ${str.len()}`);
  log(`TS Str as string: ${str.toString()}`);

  // Demonstrate methods
  log(`Str contains "MiLost": ${str.contains("MiLost")}`);
  log(`Str to uppercase: ${str.toUpperCase().toString()}`);

  return "Str type demo completed";
}
