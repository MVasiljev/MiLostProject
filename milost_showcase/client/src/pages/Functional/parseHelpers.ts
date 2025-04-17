/**
 * Helper functions for parsing various inputs in the Functional components
 */

/**
 * Parses a string into an array of values
 */
export const parseArrayInput = (input: string): any[] => {
  try {
    if (!input.trim()) return [];
    const formattedInput = input.trim().startsWith("[") ? input : `[${input}]`;
    return JSON.parse(formattedInput);
  } catch (err) {
    console.error("Error parsing array input:", err);
    return [];
  }
};

/**
 * Parses a string into an object
 */
export const parseObjectInput = (input: string): Record<string, any> => {
  try {
    if (!input.trim()) return {};
    return JSON.parse(input);
  } catch (err) {
    console.error("Error parsing object input:", err);
    return {};
  }
};

/**
 * Parses a string into an array of function strings
 */
export const parseFunctionArray = (input: string): string[] => {
  try {
    if (!input.trim()) return [];
    const parsed = parseArrayInput(input);
    return parsed.map((fn: any) => fn.toString());
  } catch (err) {
    console.error("Error parsing function array:", err);
    return [];
  }
};
