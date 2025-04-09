import {
  initWasm,
  getWasmModule,
  isWasmInitialized,
} from "../initWasm/init.js";

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

    const wasm = getWasmModule();
    const result = wasm.UIParser.create_text(content, fontStyle, color);
    return new UI(result);
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
