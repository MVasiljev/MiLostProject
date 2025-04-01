use wasm_bindgen::prelude::*;
use js_sys::{Object, Reflect};

#[wasm_bindgen]
pub struct Result {
    ok: bool,
    value: JsValue,
    error: JsValue,
}

#[wasm_bindgen]
impl Result {
    #[wasm_bindgen(constructor)]
    pub fn new(ok: bool, value: JsValue, error: JsValue) -> Result {
        Result { ok, value, error }
    }

    #[wasm_bindgen(js_name = "isOk")]
    pub fn is_ok(&self) -> bool {
        self.ok
    }

    #[wasm_bindgen(js_name = "isErr")]
    pub fn is_err(&self) -> bool {
        !self.ok
    }

    #[wasm_bindgen(js_name = "ok")]
    pub fn ok(&self) -> JsValue {
        if self.ok {
            self.value.clone()
        } else {
            JsValue::null()
        }
    }

    #[wasm_bindgen(js_name = "err")]
    pub fn err(&self) -> JsValue {
        if !self.ok {
            self.error.clone()
        } else {
            JsValue::null()
        }
    }

    #[wasm_bindgen(js_name = "unwrap")]
    pub fn unwrap(&self) -> JsValue {
        if self.ok {
            self.value.clone()
        } else {
            let error_obj = Object::new();
            Reflect::set(&error_obj, &"message".into(), &"Called unwrap on an Err result".into()).unwrap();
            throw_val(error_obj.into());
            JsValue::undefined()
        }
    }

    #[wasm_bindgen(js_name = "unwrapOr")]
    pub fn unwrap_or(&self, default_value: JsValue) -> JsValue {
        if self.ok {
            self.value.clone()
        } else {
            default_value
        }
    }

    #[wasm_bindgen(js_name = "match")]
    pub fn match_result(&self, on_ok: &js_sys::Function, on_err: &js_sys::Function) -> JsValue {
        if self.ok {
            on_ok.call1(&JsValue::null(), &self.value).unwrap_or(JsValue::undefined())
        } else {
            on_err.call1(&JsValue::null(), &self.error).unwrap_or(JsValue::undefined())
        }
    }

    #[wasm_bindgen(js_name = "getError")]
    pub fn get_error(&self) -> JsValue {
        if !self.ok {
            self.error.clone()
        } else {
            JsValue::undefined()
        }
    }
}

#[wasm_bindgen]
pub fn create_ok_result(value: JsValue) -> Result {
    Result::new(true, value, JsValue::null())
}

#[wasm_bindgen]
pub fn create_err_result(error: JsValue) -> Result {
    if error.is_null() || error.is_undefined() {
        let error_obj = Object::new();
        Reflect::set(&error_obj, &"message".into(), &"Error must be provided when creating an Err result".into()).unwrap();
        throw_val(error_obj.into());
        return Result::new(false, JsValue::null(), JsValue::null());
    }
    Result::new(false, JsValue::null(), error)
}

#[wasm_bindgen(inline_js = "export function throw_val(val) { throw val; }")]
extern "C" {
    fn throw_val(val: JsValue);
}