import { initWasm, isWasmInitialized } from "../initWasm/init.js";
import { callWasmStaticMethod } from "../initWasm/lib.js";

export class UI {
  private readonly _json: string;

  private constructor(json: string) {
    this._json = json;
  }

  static async fromJSON(json: string): Promise<UI> {
    if (!isWasmInitialized()) {
      await initWasm();
    }
    return new UI(json);
  }

  static async createText(
    content: string,
    fontStyle: string,
    color: string
  ): Promise<UI> {
    if (!isWasmInitialized()) {
      await initWasm();
    }

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
      console.error("Failed to parse UI JSON:", err);
      return null;
    }
  }
}
