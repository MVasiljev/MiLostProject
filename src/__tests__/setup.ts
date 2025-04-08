import { initWasm } from "../wasm/init";

const useWasmInitializer = () => {
  const initialize = async () => {
    try {
      await initWasm();
    } catch (error) {
      console.warn("WASM initialization failed", error);
    }
  };

  return { initialize };
};

const useTestMatchers = () => {
  const extend = () => {
    expect.extend({
      toBeInstanceOf(received: any, expected: any) {
        const pass = received instanceof expected;
        const message = pass
          ? () =>
              `expected ${received} not to be an instance of ${expected.name}`
          : () => `expected ${received} to be an instance of ${expected.name}`;

        return { message, pass };
      },
    });
  };

  return { extend };
};

const { initialize } = useWasmInitializer();
const { extend } = useTestMatchers();

beforeAll(async () => {
  extend();
  await initialize();
});
