import { fileURLToPath } from "url";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const rootDir = path.resolve(dirname, "../../");

interface Config {
  port: number;
  debug: boolean;
  wasm: {
    binaryPath: string;
    jsPath: string;
  };
}

const config: Config = {
  port: parseInt(process.env.PORT || "3000", 10),

  debug: process.env.DEBUG === "true",

  wasm: {
    binaryPath: path.resolve(
      rootDir,
      "node_modules/milost/dist/wasm/milost_wasm_bg.wasm"
    ),
    jsPath: path.resolve(
      rootDir,
      "node_modules/milost/dist/wasm/milost_wasm.js"
    ),
  },
};

export default config;
