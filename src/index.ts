import { initWasm } from "./initWasm/init.js";

// Export all modules
export * as async from "./async/index.js";
export * as atom from "./atom/index.js";
export * as borrow from "./borrow/index.js";
export * as concurrency from "./concurrency/index.js";
export * as contract from "./contract/index.js";
export * as core from "./core/index.js";
export * as memory from "./memory/index.js";
export { Patterns } from "./patterns/index.js";
export * as resource from "./resource/index.js";
export * as types from "./types/index.js";
export { Str } from "./types/string.js";
export { f64, u32, u16 } from "./types/primitives.js";
export {
  UI,
  HStackBuilder,
  VStackBuilder,
  TextBuilder,
  ButtonBuilder,
  ZStackBuilder,
  SpacerBuilder,
  DividerBuilder,
  ImageBuilder,
  ScrollBuilder,
  ScrollDirection,
  ResizeMode,
  DividerStyle,
  ButtonStyle,
} from "./ui/index.js";
export {
  renderWithMiLostTask,
  MiLost,
  mountMiLostRenderer,
} from "./ui/rendering";
export {
  AppError,
  ValidationError,
  NetworkError,
  UnauthorizedError,
  AuthenticationError,
  NotFoundError,
  ForbiddenError,
  DatabaseError,
} from "./core/error.js";
export { Result, Ok, Err } from "./core/result.js";
export { initWasm, isWasmInitialized, getWasmModule } from "./initWasm/init.js";

export { RefMut, Ref } from "./borrow";

export * from "./ui/dsl";
export * from "./ui/dsl/uiDsl.js";
export * from "./ui/dsl/renderNodeTree.js";
export * from "./regex";
export * from "./utils";

initWasm().catch(console.error);
