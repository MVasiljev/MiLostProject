import {
  getStringInfo,
  convertToUppercase,
  convertToLowercase,
  checkWasmStatus,
} from "./string.js";

const stringInput = document.getElementById("string-input") as HTMLInputElement;
const btnStringInfo = document.getElementById("btn-string-info");
const btnUppercase = document.getElementById("btn-uppercase");
const btnLowercase = document.getElementById("btn-lowercase");
const stringResult = document.getElementById("string-result");
const wasmStatus = document.getElementById("wasm-status");
const wasmExports = document.getElementById("wasm-exports");

const navLinks = document.querySelectorAll("nav a");
const sections = document.querySelectorAll("section");

async function init() {
  try {
    const status = await checkWasmStatus();

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

navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const target = link.getAttribute("href")?.substring(1);

    if (!target) return;

    sections.forEach((section) => {
      section.classList.remove("active");
      if (section.id === target) {
        section.classList.add("active");
      }
    });
  });
});

document.addEventListener("DOMContentLoaded", init);
