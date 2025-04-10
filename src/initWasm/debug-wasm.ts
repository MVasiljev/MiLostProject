import { getWasmModule, initWasm } from ".";

async function debugWasmExports() {
  try {
    console.log("Initializing WASM module...");
    await initWasm();
    console.log("WASM module initialized successfully!");

    const wasmModule = getWasmModule();
    console.log("WASM module top-level exports:", Object.keys(wasmModule));

    function examineExport(exportName: string) {
      try {
        const exportObj = wasmModule[exportName];
        if (typeof exportObj === "function") {
          console.log(`${exportName} is a function`);
          try {
            if (exportObj.prototype) {
              console.log(
                `${exportName} appears to be a constructor with prototype methods:`,
                Object.getOwnPropertyNames(exportObj.prototype).filter(
                  (p) => p !== "constructor"
                )
              );
            }
          } catch (e) {
            console.log(
              `${exportName} is a function but not a typical constructor`
            );
          }
        } else if (typeof exportObj === "object" && exportObj !== null) {
          console.log(
            `${exportName} is an object with properties:`,
            Object.keys(exportObj)
          );
        } else {
          console.log(`${exportName} is a ${typeof exportObj}`);
        }
      } catch (e) {
        console.log(`Error examining ${exportName}:`, e);
      }
    }

    const componentsToCheck = [
      "VStack",
      "HStack",
      "ZStack",
      "Text",
      "Button",
      "Image",
      "ImageComponent",
      "Spacer",
      "Divider",
      "Scroll",
      "ui_VStack",
      "ui_HStack",
      "components_VStack",
    ];

    console.log("\n--- Examining UI Component Exports ---");
    for (const component of componentsToCheck) {
      if (wasmModule[component]) {
        console.log(`\nFound ${component}:`);
        examineExport(component);
      } else {
        console.log(`Component ${component} not found in WASM exports`);
      }
    }

    console.log("\n--- Checking for static factory methods ---");
    const factoryMethods = [
      "create_heading",
      "create_paragraph",
      "create_avatar_image",
      "light_divider",
      "dark_divider",
      "create_primary_button",
    ];

    for (const method of factoryMethods) {
      if (typeof wasmModule[method] === "function") {
        console.log(`Found factory method: ${method}`);
      } else {
        console.log(`Factory method ${method} not found`);
      }
    }

    console.log("\n--- Checking for rendering exports ---");
    const renderingExports = [
      "WebRenderer",
      "render_to_canvas_element",
      "get_render_node",
    ];

    for (const export_ of renderingExports) {
      if (wasmModule[export_]) {
        console.log(`Found rendering export: ${export_}`);
        examineExport(export_);
      } else {
        console.log(`Rendering export ${export_} not found`);
      }
    }
  } catch (error) {
    console.error("Error during WASM debugging:", error);
  }
}

debugWasmExports();
