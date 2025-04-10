import { initWasm, isWasmInitialized } from "../initWasm/init.js";
import { callWasmStaticMethod } from "../initWasm/lib.js";

export class UI {
  private readonly _json: string;

  private constructor(json: string) {
    this._json = json;
  }

  private static async ensureWasmInitialized(): Promise<void> {
    if (!isWasmInitialized()) {
      try {
        await initWasm();
      } catch (error) {
        console.warn(`WASM initialization failed: ${error}`);
      }
    }
  }

  static async fromJSON(json: string): Promise<UI> {
    try {
      await this.ensureWasmInitialized();
      return new UI(json);
    } catch (error) {
      console.warn(`UI.fromJSON fallback used: ${error}`);
      return new UI(json);
    }
  }

  static async createText(
    content: string,
    fontStyle: string,
    color: string
  ): Promise<UI> {
    try {
      await this.ensureWasmInitialized();

      const json = callWasmStaticMethod<string>(
        "UIParser",
        "create_text",
        [content, fontStyle, color],
        () => {
          throw new Error(
            "Failed to create text component - WASM function unavailable"
          );
        }
      );

      return new UI(json);
    } catch (error) {
      console.warn(`UI.createText fallback used: ${error}`);
      const fallbackJson = JSON.stringify({
        type: "Text",
        content,
        fontStyle,
        color,
      });
      return new UI(fallbackJson);
    }
  }

  toJSON(): string {
    return this._json;
  }

  toString(): string {
    try {
      return JSON.stringify(JSON.parse(this._json), null, 2);
    } catch {
      return this._json;
    }
  }

  unwrap(): any {
    try {
      return JSON.parse(this._json);
    } catch (err) {
      console.warn("Failed to parse UI JSON:", err);
      return null;
    }
  }
}
