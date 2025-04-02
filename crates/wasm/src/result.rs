use wasm_bindgen::prelude::*;
use js_sys::{Reflect, Function};

#[wasm_bindgen]
pub struct ResultWrapper {
    is_ok: bool,
    value: JsValue,
    error: JsValue,
}

#[wasm_bindgen]
impl ResultWrapper {
    #[wasm_bindgen(constructor)]
    pub fn new(is_ok: bool, value: JsValue, error: JsValue) -> Self {
        Self {
            is_ok,
            value,
            error,
        }
    }

    #[wasm_bindgen(js_name = "ok")]
    pub fn ok(value: &JsValue) -> Self {
        Self {
            is_ok: true,
            value: value.clone(),
            error: JsValue::NULL,
        }
    }

    #[wasm_bindgen(js_name = "err")]
    pub fn err(error: &JsValue) -> Self {
        Self {
            is_ok: false,
            value: JsValue::NULL,
            error: error.clone(),
        }
    }

    #[wasm_bindgen(js_name = "isOk")]
    pub fn is_ok(&self) -> bool {
        self.is_ok
    }

    #[wasm_bindgen(js_name = "isErr")]
    pub fn is_err(&self) -> bool {
        !self.is_ok
    }

    #[wasm_bindgen(js_name = "unwrap")]
    pub fn unwrap(&self) -> JsValue {
        if self.is_ok {
            self.value.clone()
        } else {
            let error = js_sys::Error::new("Called unwrap on an Err value");
            error.into()
        }
    }

    #[wasm_bindgen(js_name = "unwrapErr")]
    pub fn unwrap_err(&self) -> JsValue {
        if self.is_err() {
            self.error.clone()
        } else {
            let error = js_sys::Error::new("Called unwrapErr on an Ok value");
            error.into()
        }
    }

    #[wasm_bindgen(js_name = "unwrapOr")]
    pub fn unwrap_or(&self, default_value: &JsValue) -> JsValue {
        if self.is_ok {
            self.value.clone()
        } else {
            default_value.clone()
        }
    }

    #[wasm_bindgen(js_name = "match")]
    pub fn match_result(&self, on_ok: &Function, on_err: &Function) -> JsValue {
        if self.is_ok {
            on_ok.call1(&JsValue::NULL, &self.value)
                .unwrap_or(JsValue::NULL)
        } else {
            on_err.call1(&JsValue::NULL, &self.error)
                .unwrap_or(JsValue::NULL)
        }
    }

    #[wasm_bindgen(js_name = "getError")]
    pub fn get_error(&self) -> JsValue {
        if self.is_err() {
            self.error.clone()
        } else {
            JsValue::UNDEFINED
        }
    }
}

// Changed function names to avoid conflicts
#[wasm_bindgen(js_name = "createOkResultWrapper")]
pub fn create_ok_result_wrapper(value: &JsValue) -> ResultWrapper {
    ResultWrapper::ok(value)
}

#[wasm_bindgen(js_name = "createErrResultWrapper")]
pub fn create_err_result_wrapper(error: &JsValue) -> ResultWrapper {
    ResultWrapper::err(error)
}

#[wasm_bindgen(js_name = "tryCatchWrapper")]
pub fn try_catch_wrapper(fn_call: &Function, error_handler: Option<Function>) -> ResultWrapper {
    let result = fn_call.call0(&JsValue::NULL);
    
    match result {
        Ok(value) => ResultWrapper::ok(&value),
        Err(js_error) => {
            if let Some(handler) = error_handler {
                let handled_error = handler.call1(&JsValue::NULL, &js_error).unwrap_or(js_error);
                ResultWrapper::err(&handled_error)
            } else {
                // Default error handling
                let error = js_sys::Error::new("Operation failed");
                let _ = Reflect::set(&error, &JsValue::from_str("originalError"), &js_error);
                ResultWrapper::err(&error.into())
            }
        }
    }
}