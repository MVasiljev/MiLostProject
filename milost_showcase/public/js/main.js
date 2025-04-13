/**
 * Simple client-side code for MiLost showcase
 */

const stringInput = document.getElementById("string-input");
const btnStringInfo = document.getElementById("btn-string-info");
const btnUppercase = document.getElementById("btn-uppercase");
const btnLowercase = document.getElementById("btn-lowercase");
const stringResult = document.getElementById("string-result");
const wasmStatus = document.getElementById("wasm-status");
const wasmExports = document.getElementById("wasm-exports");

async function init() {
  try {
    const response = await fetch("/api/status");
    const status = await response.json();

    if (wasmStatus) {
      wasmStatus.textContent = JSON.stringify(status, null, 2);
    }

    if (wasmExports) {
      wasmExports.textContent = JSON.stringify(status.exports, null, 2);
    }

    console.log("MiLost Client Initialized");
  } catch (error) {
    console.error("Failed to initialize client:", error);
    if (wasmStatus) {
      wasmStatus.textContent = "Error loading WASM status";
    }
  }
}

async function getStringInfo(text) {
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

async function convertToUppercase(text) {
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

async function convertToLowercase(text) {
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

if (btnStringInfo) {
  btnStringInfo.addEventListener("click", async () => {
    if (!stringInput || !stringResult) return;

    try {
      const text = stringInput.value;
      const info = await getStringInfo(text);
      stringResult.textContent = JSON.stringify(info, null, 2);
    } catch (error) {
      console.error("Error getting string info:", error);
      stringResult.textContent = "Error processing request";
    }
  });
}

if (btnUppercase) {
  btnUppercase.addEventListener("click", async () => {
    if (!stringInput || !stringResult) return;

    try {
      const text = stringInput.value;
      const result = await convertToUppercase(text);
      stringResult.textContent = JSON.stringify(result, null, 2);
    } catch (error) {
      console.error("Error converting to uppercase:", error);
      stringResult.textContent = "Error processing request";
    }
  });
}

if (btnLowercase) {
  btnLowercase.addEventListener("click", async () => {
    if (!stringInput || !stringResult) return;

    try {
      const text = stringInput.value;
      const result = await convertToLowercase(text);
      stringResult.textContent = JSON.stringify(result, null, 2);
    } catch (error) {
      console.error("Error converting to lowercase:", error);
      stringResult.textContent = "Error processing request";
    }
  });
}

document.querySelectorAll("nav a").forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const target = link.getAttribute("href")?.substring(1);

    if (!target) return;

    document.querySelectorAll("section").forEach((section) => {
      section.classList.remove("active");
      if (section.id === target) {
        section.classList.add("active");
      }
    });
  });
});

document.addEventListener("DOMContentLoaded", init);
