use wasm_bindgen::prelude::*;
use js_sys::{Object, Reflect};

#[wasm_bindgen]
pub struct Option {
    some: bool,
    value: JsValue,
}

#[wasm_bindgen]
impl Option {
    #[wasm_bindgen(constructor)]
    pub fn new(some: bool, value: JsValue) -> Option {
        Option { some, value }
    }

    #[wasm_bindgen(js_name = "isSome")]
    pub fn is_some(&self) -> bool {
        self.some
    }

    #[wasm_bindgen(js_name = "isNone")]
    pub fn is_none(&self) -> bool {
        !self.some
    }

    #[wasm_bindgen(js_name = "unwrap")]
    pub fn unwrap(&self) -> Result<JsValue, JsValue> {
        if self.some {
            Ok(self.value.clone())
        } else {
            let error = Object::new();
            Reflect::set(&error, &"message".into(), &"Called unwrap on a None value".into())?;
            Reflect::set(&error, &"name".into(), &"ValidationError".into())?;
            Err(error.into())
        }
    }

    #[wasm_bindgen(js_name = "unwrapOr")]
    pub fn unwrap_or(&self, default_value: JsValue) -> JsValue {
        if self.some {
            self.value.clone()
        } else {
            default_value
        }
    }

    #[wasm_bindgen(js_name = "match")]
    pub fn match_option(&self, on_some: &js_sys::Function, on_none: &js_sys::Function) -> Result<JsValue, JsValue> {
        if self.some {
            on_some.call1(&JsValue::null(), &self.value)
        } else {
            on_none.call0(&JsValue::null())
        }
    }

    #[wasm_bindgen(js_name = "filter")]
    pub fn filter(&self, predicate: &js_sys::Function) -> Result<Option, JsValue> {
        if self.some {
            let result = predicate.call1(&JsValue::null(), &self.value)?;
            if result.is_truthy() {
                Ok(self.clone())
            } else {
                Ok(Option::new(false, JsValue::undefined()))
            }
        } else {
            Ok(Option::new(false, JsValue::undefined()))
        }
    }

    #[wasm_bindgen(js_name = "exists")]
    pub fn exists(&self, predicate: &js_sys::Function) -> Result<bool, JsValue> {
        if self.some {
            let result = predicate.call1(&JsValue::null(), &self.value)?;
            Ok(result.is_truthy())
        } else {
            Ok(false)
        }
    }

    #[wasm_bindgen(js_name = "toString")]
    pub fn to_string(&self) -> String {
        if self.some {
            match js_sys::JSON::stringify(&self.value) {
                Ok(json_str) => format!("[Some {}]", json_str),
                Err(_) => "[Some <unprintable>]".to_string(),
            }
        } else {
            "[None]".to_string()
        }
    }

    #[wasm_bindgen(js_name = "clone")]
    pub fn clone(&self) -> Option {
        Option {
            some: self.some,
            value: self.value.clone(),
        }
    }
}

#[wasm_bindgen(js_name = "createSome")]
pub fn create_some(value: JsValue) -> Result<Option, JsValue> {
    if value.is_null() || value.is_undefined() {
        let error = Object::new();
        Reflect::set(&error, &"message".into(), &"Cannot create Some with null or undefined value".into())?;
        Reflect::set(&error, &"name".into(), &"ValidationError".into())?;
        return Err(error.into());
    }
    Ok(Option::new(true, value))
}

#[wasm_bindgen(js_name = "createNone")]
pub fn create_none() -> Option {
    Option::new(false, JsValue::undefined())
}

#[wasm_bindgen(js_name = "createFrom")]
pub fn create_from(value: JsValue) -> Option {
    if value.is_null() || value.is_undefined() {
        Option::new(false, JsValue::undefined())
    } else {
        Option::new(true, value)
    }
}