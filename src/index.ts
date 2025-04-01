import { initWasm } from "./wasm/init.js";

// Export all modules
export * as async from "./async/index.js";
export * as atom from "./atom/index.js";
export * as borrow from "./borrow/index.js";
export * as concurrency from "./concurrency/index.js";
export * as contract from "./contract/index.js";
export * as core from "./core/index.js";
export * as memory from "./memory/index.js";
export * as patterns from "./patterns/index.js";
export * as resource from "./resource/index.js";
export * as types from "./types/index.js";
export { Str } from "./types/string.js";
export {
  UI,
  HStackBuilder,
  VStackBuilder,
  TextBuilder,
  ButtonBuilder,
} from "./ui/ui.js";
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

export { RefMut, Ref } from "./borrow";

initWasm().catch(console.error);
