use wasm_bindgen::prelude::*;
use js_sys::{Array, Function, Promise};
use wasm_bindgen::JsCast;

fn shallow_equal(a: &Vec<JsValue>, b: &Vec<JsValue>) -> bool {
    if a.len() != b.len() {
        return false;
    }
    for (i, val_a) in a.iter().enumerate() {
        if !val_a.eq(&b[i]) {
            return false;
        }
    }
    true
}

#[wasm_bindgen]
pub struct JsComputed {
    value: JsValue,
    watch_values: Vec<JsValue>,
    compute: Function,
}

#[wasm_bindgen]
impl JsComputed {
    #[wasm_bindgen(constructor)]
    pub fn new(compute: Function, watch_values: Array) -> Result<JsComputed, JsValue> {
        let watch_vec = watch_values.to_vec();
        let result = compute.call0(&JsValue::NULL)?;
        Ok(JsComputed {
            value: result,
            watch_values: watch_vec,
            compute,
        })
    }

    #[wasm_bindgen(js_name = get)]
    pub fn get(&self) -> JsValue {
        self.value.clone()
    }

    #[wasm_bindgen(js_name = update)]
    pub fn update(&mut self, new_watch_values: Array) -> Result<(), JsValue> {
        let new_vec = new_watch_values.to_vec();
        if !shallow_equal(&self.watch_values, &new_vec) {
            self.watch_values = new_vec;
            self.value = self.compute.call0(&JsValue::NULL)?;
        }
        Ok(())
    }

    #[wasm_bindgen(js_name = toJSON)]
    pub fn to_json(&self) -> JsValue {
        self.value.clone()
    }

    #[wasm_bindgen(js_name = toString)]
    pub fn to_string(&self) -> String {
        let json = js_sys::JSON::stringify(&self.value).unwrap_or_else(|_| JsValue::from_str("null").unchecked_into());
        format!("[Computed {}]", json.as_string().unwrap_or("null".to_string()))
    }
}

#[wasm_bindgen]
pub struct JsWatcher {
    last_value: JsValue,
    watch_fn: Function,
    callback_fn: Function,
}

#[wasm_bindgen]
impl JsWatcher {
    #[wasm_bindgen(constructor)]
    pub fn new(watch_fn: Function, callback_fn: Function) -> Result<JsWatcher, JsValue> {
        let initial = watch_fn.call0(&JsValue::NULL)?;
        Ok(JsWatcher {
            last_value: initial,
            watch_fn,
            callback_fn,
        })
    }

    #[wasm_bindgen(js_name = check)]
    pub fn check(&mut self) -> Result<(), JsValue> {
        let current = self.watch_fn.call0(&JsValue::NULL)?;
        if !current.eq(&self.last_value) {
            self.last_value = current.clone();
            self.callback_fn.call1(&JsValue::NULL, &current)?;
        }
        Ok(())
    }

    #[wasm_bindgen(js_name = toString)]
    pub fn to_string(&self) -> String {
        "[Watcher]".to_string()
    }
}

#[wasm_bindgen]
pub struct JsAsyncEffect {
    active: std::cell::Cell<bool>,
}

#[wasm_bindgen]
impl JsAsyncEffect {
    #[wasm_bindgen(constructor)]
    pub fn new(effect: Function) -> JsAsyncEffect {
        let instance = JsAsyncEffect {
            active: std::cell::Cell::new(true),
        };

        let active_flag = instance.active.clone();

        let promise_result = effect.call0(&JsValue::NULL);
        if let Ok(js_promise) = promise_result {
            if js_promise.is_instance_of::<Promise>() {
                let promise: Promise = js_promise.unchecked_into();
                let active_flag_reject = active_flag.clone();
                let on_reject = Closure::wrap(Box::new(move |err: JsValue| {
                    if active_flag_reject.get() {
                        web_sys::console::error_2(&"AsyncEffect error:".into(), &err);
                    }
                }) as Box<dyn FnMut(JsValue)>);

                let active_flag_finally = active_flag.clone();
                let on_finally = Closure::wrap(Box::new(move || {
                    active_flag_finally.set(false);
                }) as Box<dyn FnMut()>);

                let _ = promise.then(&Closure::wrap(Box::new(|_| {}) as Box<dyn FnMut(JsValue)>));
                let _ = promise.catch(&on_reject);
                let _ = promise.finally(&on_finally);

                on_reject.forget();
                on_finally.forget();
            }
        }

        instance
    }

    #[wasm_bindgen(js_name = cancel)]
    pub fn cancel(&self) {
        self.active.set(false);
    }

    #[wasm_bindgen(js_name = toString)]
    pub fn to_string(&self) -> String {
        "[AsyncEffect]".to_string()
    }
}
