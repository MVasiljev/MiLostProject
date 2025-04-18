/**
 * Helper functions for parsing various inputs in the Functional components
 */

/**
 * Parses a string into an array of values
 */
export const parseArrayInput = (input: string): any[] => {
  if (!input || !input.trim()) return [];

  try {
    if (input.trim().startsWith("[") && input.trim().endsWith("]")) {
      return JSON.parse(input);
    } else {
      return input
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item !== "")
        .map((item) => {
          if (item.toLowerCase() === "true") return true;
          if (item.toLowerCase() === "false") return false;
          if (item === "null") return null;
          if (item === "undefined") return undefined;

          if (/^-?\d+(\.\d+)?$/.test(item)) {
            return Number(item);
          }

          return item;
        });
    }
  } catch (err) {
    console.error("Error parsing array input:", err);
    return [];
  }
};

/**
 * Parses a string into an object
 */
export const parseObjectInput = (input: string): Record<string, any> => {
  if (!input || !input.trim()) return {};

  try {
    return JSON.parse(input);
  } catch (err) {
    console.error("Error parsing object input:", err);
    return {};
  }
};

/**
 * Safely parses a function array to return string representations
 */
export const parseFunctionArray = (input: string): string[] => {
  if (!input || !input.trim()) return [];

  try {
    if (input.trim().startsWith("[") && input.trim().endsWith("]")) {
      const matches =
        input.match(/\(.*?\)(?:\s*=>|\s*\{).*?(?:\}|(?=[,\]]))/g) || [];
      return matches.map((fn) => fn.trim());
    }

    return [];
  } catch (err) {
    console.error("Error parsing function array:", err);
    return [];
  }
};

/**
 * Validates if a string contains a valid function expression
 */
export const isValidFunction = (input: string): boolean => {
  if (!input || !input.trim()) return false;

  try {
    const trimmed = input.trim();

    if (/^\(.*?\)\s*=>/.test(trimmed)) {
      return true;
    }

    if (/^function\s*\(.*?\)\s*\{/.test(trimmed)) {
      return true;
    }

    return false;
  } catch (err) {
    return false;
  }
};

/**
 * Converts a function string to a safe function representation
 * This is only used for display purposes, not for execution
 */
export const functionToString = (fn: Function): string => {
  if (!fn) return "";

  try {
    return fn.toString();
  } catch (err) {
    console.error("Error converting function to string:", err);
    return "";
  }
};

/**
 * Safely stringifies a value for display or transmission
 */
export const safeStringify = (value: any): string => {
  try {
    return JSON.stringify(
      value,
      (key, val) => {
        if (typeof val === "function") {
          return val.toString();
        }
        return val;
      },
      2
    );
  } catch (err) {
    console.error("Error stringifying value:", err);
    return String(value);
  }
};
