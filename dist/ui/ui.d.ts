export type FontStyleType = "Title" | "Body" | "Caption";
export type ColorType = "White" | "Blue" | "Black";
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
export declare class VStackBuilder {
    private _builder;
    constructor();
    spacing(value: number): VStackBuilder;
    padding(value: number): VStackBuilder;
    background(color: ColorType): VStackBuilder;
    child(component: UI | TextBuilder | HStackBuilder | VStackBuilder | ButtonBuilder): Promise<VStackBuilder>;
    private convertBuilderToJson;
    build(): Promise<UI>;
    static create(): Promise<VStackBuilder>;
}
export declare class HStackBuilder {
    private _builder;
    constructor();
    spacing(value: number): HStackBuilder;
    padding(value: number): HStackBuilder;
    background(color: ColorType): HStackBuilder;
    child(component: UI | TextBuilder | HStackBuilder | VStackBuilder | ButtonBuilder): Promise<HStackBuilder>;
    private convertBuilderToJson;
    build(): Promise<UI>;
    static create(): Promise<HStackBuilder>;
}
export declare class TextBuilder {
    private _builder;
    constructor(content: string);
    fontStyle(style: FontStyleType): TextBuilder;
    color(color: ColorType): TextBuilder;
    build(): Promise<UI>;
    static create(content: string): Promise<TextBuilder>;
}
export declare class ButtonBuilder {
    private _builder;
    constructor(label: string);
    onTap(handler: string): ButtonBuilder;
    build(): Promise<UI>;
    static create(label: string): Promise<ButtonBuilder>;
}
