import { initWasm, getWasmModule, isWasmInitialized } from "../wasm/init.js";
export class UI {
    constructor(json, wasm) {
        this._json = json;
        this._wasm = wasm;
    }
    static async fromJSON(json) {
        if (!isWasmInitialized()) {
            await initWasm();
        }
        return new UI(json, true);
    }
    static async createText(content, fontStyle, color) {
        if (!isWasmInitialized()) {
            await initWasm();
        }
        const wasm = getWasmModule();
        const result = wasm.UIParser.create_text(content, fontStyle, color);
        return new UI(result, true);
    }
    unwrap() {
        try {
            return JSON.parse(this._json);
        }
        catch (err) {
            console.error("Failed to parse WASM UI output:", err);
            return null;
        }
    }
    toJSON() {
        return this._json;
    }
    toString() {
        return JSON.stringify(this.unwrap(), null, 2);
    }
}
//# sourceMappingURL=ui.js.map