import { Str } from "milost";

/**
 * String operations API using MiLost's Str implementation
 */
export const stringApi = {
  /**
   * Create a new MiLost Str from a raw string
   */
  create(input: string): { value: string; length: number } {
    const str = Str.fromRaw(input);
    return {
      value: str.unwrap(),
      length: str.len(),
    };
  },

  /**
   * Convert a string to uppercase
   */
  toUpperCase(input: string): { original: string; result: string } {
    const str = Str.fromRaw(input);
    const upperStr = str.toUpperCase();
    return {
      original: str.unwrap(),
      result: upperStr.unwrap(),
    };
  },

  /**
   * Convert a string to lowercase
   */
  toLowerCase(input: string): { original: string; result: string } {
    const str = Str.fromRaw(input);
    const lowerStr = str.toLowerCase();
    return {
      original: str.unwrap(),
      result: lowerStr.unwrap(),
    };
  },

  /**
   * Get string information (length, empty status)
   */
  getInfo(input: string): { value: string; length: number; isEmpty: boolean } {
    const str = Str.fromRaw(input);
    return {
      value: str.unwrap(),
      length: str.len(),
      isEmpty: str.isEmpty(),
    };
  },
};

export default stringApi;
