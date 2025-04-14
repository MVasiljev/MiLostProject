interface Config {
    port: number;
    debug: boolean;
    wasm: {
        binaryPath: string;
        jsPath: string;
    };
}
declare const config: Config;
export default config;
