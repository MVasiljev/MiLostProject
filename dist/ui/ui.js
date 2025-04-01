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
export class VStackBuilder {
    constructor() {
        if (!isWasmInitialized()) {
            throw new Error("WASM module not initialized. Please call initWasm() first.");
        }
        const wasm = getWasmModule();
        this._builder = new wasm.VStackBuilder();
    }
    spacing(value) {
        this._builder = this._builder.spacing(value);
        return this;
    }
    padding(value) {
        this._builder = this._builder.padding(value);
        return this;
    }
    background(color) {
        this._builder = this._builder.background(color);
        return this;
    }
    async child(component) {
        let json;
        if (component instanceof UI) {
            json = component.toJSON();
        }
        else if (component instanceof TextBuilder) {
            json = await this.convertBuilderToJson(component);
        }
        else if (component instanceof HStackBuilder ||
            component instanceof VStackBuilder ||
            component instanceof ButtonBuilder) {
            json = await this.convertBuilderToJson(component);
        }
        else {
            throw new Error("Invalid component type");
        }
        this._builder = this._builder.child(json);
        return this;
    }
    async convertBuilderToJson(builder) {
        const wasmBuilder = builder._builder;
        if (!wasmBuilder || !wasmBuilder.build) {
            throw new Error("Invalid builder object");
        }
        try {
            const result = wasmBuilder.build();
            return result;
        }
        catch (error) {
            console.error("Error converting builder to JSON:", error);
            throw error;
        }
    }
    async build() {
        try {
            const result = this._builder.build();
            return UI.fromJSON(result);
        }
        catch (error) {
            console.error("Error building VStack component:", error);
            throw error;
        }
    }
    static async create() {
        if (!isWasmInitialized()) {
            await initWasm();
        }
        return new VStackBuilder();
    }
}
export class HStackBuilder {
    constructor() {
        if (!isWasmInitialized()) {
            throw new Error("WASM module not initialized. Please call initWasm() first.");
        }
        const wasm = getWasmModule();
        this._builder = new wasm.HStackBuilder();
    }
    spacing(value) {
        this._builder = this._builder.spacing(value);
        return this;
    }
    padding(value) {
        this._builder = this._builder.padding(value);
        return this;
    }
    background(color) {
        this._builder = this._builder.background(color);
        return this;
    }
    async child(component) {
        let json;
        if (component instanceof UI) {
            json = component.toJSON();
        }
        else if (component instanceof TextBuilder) {
            json = await this.convertBuilderToJson(component);
        }
        else if (component instanceof HStackBuilder ||
            component instanceof VStackBuilder ||
            component instanceof ButtonBuilder) {
            json = await this.convertBuilderToJson(component);
        }
        else {
            throw new Error("Invalid component type");
        }
        this._builder = this._builder.child(json);
        return this;
    }
    async convertBuilderToJson(builder) {
        const wasmBuilder = builder._builder;
        if (!wasmBuilder || !wasmBuilder.build) {
            throw new Error("Invalid builder object");
        }
        try {
            const result = wasmBuilder.build();
            return result;
        }
        catch (error) {
            console.error("Error converting builder to JSON:", error);
            throw error;
        }
    }
    async build() {
        try {
            const result = this._builder.build();
            return UI.fromJSON(result);
        }
        catch (error) {
            console.error("Error building HStack component:", error);
            throw error;
        }
    }
    static async create() {
        if (!isWasmInitialized()) {
            await initWasm();
        }
        return new HStackBuilder();
    }
}
export class TextBuilder {
    constructor(content) {
        if (!isWasmInitialized()) {
            throw new Error("WASM module not initialized. Please call initWasm() first.");
        }
        const wasm = getWasmModule();
        this._builder = new wasm.TextBuilder(content);
    }
    fontStyle(style) {
        this._builder = this._builder.font_style(style);
        return this;
    }
    color(color) {
        this._builder = this._builder.color(color);
        return this;
    }
    async build() {
        try {
            const result = this._builder.build();
            return UI.fromJSON(result);
        }
        catch (error) {
            console.error("Error building Text component:", error);
            throw error;
        }
    }
    static async create(content) {
        if (!isWasmInitialized()) {
            await initWasm();
        }
        return new TextBuilder(content);
    }
}
export class ButtonBuilder {
    constructor(label) {
        if (!isWasmInitialized()) {
            throw new Error("WASM module not initialized. Please call initWasm() first.");
        }
        const wasm = getWasmModule();
        this._builder = new wasm.ButtonBuilder(label);
    }
    onTap(handler) {
        this._builder = this._builder.on_tap(handler);
        return this;
    }
    async build() {
        try {
            const result = this._builder.build();
            return UI.fromJSON(result);
        }
        catch (error) {
            console.error("Error building Button component:", error);
            throw error;
        }
    }
    static async create(label) {
        if (!isWasmInitialized()) {
            await initWasm();
        }
        return new ButtonBuilder(label);
    }
}
//# sourceMappingURL=ui.js.map