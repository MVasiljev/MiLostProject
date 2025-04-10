import { initWasm } from "./initWasm/init.js";

export { AsyncUtils, async } from "./async/index.js";

export {
  Atom,
  createAtom,
  createAction,
  createAsyncAction,
  Selector,
  createSelector,
  deriveAtom,
  combineAtoms,
  createLoggerMiddleware,
  createPersistMiddleware,
  AtomError,
  AtomManager,
  AtomOptions,
  Middleware,
  Listener,
  Unsubscribe,
  StateUpdater,
  EqualityFn,
  AtomContextError,
  AtomRecord,
  AtomContext,
  AtomContextImpl,
  createAtomContext,
  AtomHub,
  bindAtomContext,
  IntegrationError,
  Store,
  WritableStore,
  createStoreAdapter,
  Action,
  Reducer,
  createReducerAtom,
  Observable,
  fromObservable,
  toObservable,
  createAtomSlice,
  createAtomSliceWithOptions,
  createStoreFactory,
  bindToFramework,
  createSubscriber,
  createComputed,
  createBatchUpdates,
} from "./atom/index.js";

export { Owned, Ref, RefMut, OwnershipError } from "./borrow/index.js";

export {
  ChannelError,
  Sender,
  Receiver,
  createChannel,
} from "./concurrency/channel.js";

export { Task, TaskError } from "./concurrency/task.js";

export {
  ContractError,
  initContracts,
  requires,
  ensures,
  contract,
  Invariant,
} from "./contract/index.js";

export {
  AppError,
  ValidationError,
  NetworkError,
  AuthenticationError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
  DatabaseError,
  ServerError,
  DomainErrors,
  createErrorFactory,
  initErrors,
} from "./core/error.js";

export { Result, Ok, Err, tryFn, tryAsync, apiRequest } from "./core/result.js";

export { Iter } from "./core/iter.js";

export { Option } from "./core/option.js";

export {
  initFunctional,
  toHashMap,
  toHashSet,
  toVec,
  mapObject,
  filterObject,
  mergeDeep,
  pipe,
  compose,
  curry,
  memoize,
  once,
  throttle,
  debounce,
  noop,
  identity,
  not,
  allOf,
  anyOf,
  prop,
  hasProp,
  propEq,
  partial,
  flip,
  juxt,
  zipWith,
  converge,
} from "./core/functional.js";

export {
  Rc,
  Weak,
  RefCell,
  RcRefCell,
  Arc,
  createRc,
  createWeak,
  createRefCell,
  createRcRefCell,
  createArc,
  Mutex,
  RwLock,
  ArcMutex,
  createMutex,
  createRwLock,
  createArcMutex,
  Computed,
  Watcher,
  AsyncEffect,
  createRcRefCell as createRcRefCellMemory,
  createArc as createArcMemory,
} from "./memory/index.js";

export {
  Patterns,
  MatchBuilder,
  build,
  __,
  matchValue,
  matchPattern,
  matchType,
  matchTag,
  matchCases,
} from "./patterns/index.js";

export {
  Resource,
  ResourceError,
  withResource,
  DisposableGroup,
  IDisposable,
  useDisposableResource,
} from "./resource/index.js";

export {
  Brand,
  Branded,
  Fallible,
  AsyncFallible,
  Optional,
  Nullable,
  NonNullable,
  Readonly,
  DeepReadonly,
  Thunk,
  LoadingState,
  LoadingStates,
  ExtractOption,
  ExtractResult,
  ExtractError,
  isDefined,
  StrRecord,
  isObject,
  isVec,
  isStr,
  isNumeric,
  isBoolean,
  isFunction,
  AsyncDisposable,
  Disposable,
  Json,
  Positive,
  Negative,
  NonNegative,
  Percentage,
  BrandTypes,
  iterableToVec,
  Types,
  initCommon,
} from "./types";

export { Str } from "./types/string.js";

export {
  u8,
  u16,
  u32,
  u64,
  usize,
  i8,
  i16,
  i32,
  i64,
  isize,
  f32,
  f64,
  byte,
  short,
  int,
  long,
  uint,
  ulong,
  float,
  double,
  limits,
  validateU8,
  validateU16,
  validateU32,
  validateI8,
  validateI16,
  validateI32,
  Byte,
  Short,
  Int,
  Long,
  UInt,
  ULong,
  Float,
  Double,
  add_u8,
  add_u16,
  add_u32,
  sub_u32,
  mul_u32,
  div_u32,
  u8_to_u16,
  u8_to_u32,
  i8_to_i16,
  i8_to_i32,
  format_bin,
  format_hex,
  format_oct,
  format_int,
  format_float,
  is_power_of_two,
  next_power_of_two,
  leading_zeros,
  trailing_zeros,
  count_ones,
  bitwise_and,
  bitwise_or,
  bitwise_xor,
  bitwise_not,
  shift_left,
  shift_right,
  to_binary,
  to_hex,
  to_octal,
} from "./types/primitives.js";

export { HashMap } from "./types/hash_map.js";

export { HashSet } from "./types/hash_set.js";

export { Struct } from "./types/struct.js";

export { Tuple } from "./types/tuple.js";

export { Vec } from "./types/vec.js";

export {
  initWasm,
  isWasmInitialized,
  getWasmModule,
  callWasmInstanceMethod,
  callWasmStaticMethod,
  createWasmInstance,
} from "./initWasm/index.js";

export {
  Graph,
  GraphEdge,
  GraphError,
  createGraph,
} from "./utils/algorithms/index.js";

export { Sorting } from "./utils/index.js";
export { Search } from "./utils/index.js";
export { TextProcessing } from "./utils/index.js";
export { ImageProcessing } from "./utils/index.js";
export { Compression } from "./utils/index.js";
export { Crypto } from "./utils/index.js";

initWasm().catch(console.error);
