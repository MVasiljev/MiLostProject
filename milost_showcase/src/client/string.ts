/**
 * Client-side code for string operations
 */

/**
 * Get information about a string
 */
export async function getStringInfo(text: string): Promise<any> {
  try {
    const response = await fetch(
      `/api/string/info?text=${encodeURIComponent(text)}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching string info:", error);
    throw error;
  }
}

/**
 * Convert a string to uppercase
 */
export async function convertToUppercase(text: string): Promise<any> {
  try {
    const response = await fetch("/api/string/uppercase", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error converting to uppercase:", error);
    throw error;
  }
}

/**
 * Convert a string to lowercase
 */
export async function convertToLowercase(text: string): Promise<any> {
  try {
    const response = await fetch("/api/string/lowercase", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error converting to lowercase:", error);
    throw error;
  }
}

/**
 * Check status of the WASM initialization
 */
export async function checkWasmStatus(): Promise<any> {
  try {
    const response = await fetch("/api/status");

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error checking WASM status:", error);
    throw error;
  }
}
