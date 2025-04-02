import type { FontStyleType, ColorType } from "./types.js";
export declare class UI {
    private readonly _json;
    private readonly _wasm;
    constructor(json: string, wasm: boolean);
    static fromJSON(json: string): Promise<UI>;
    static createText(content: string, fontStyle: FontStyleType, color: ColorType): Promise<UI>;
    unwrap(): any;
    toJSON(): string;
    toString(): string;
}
