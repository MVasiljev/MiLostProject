use wasm_bindgen::prelude::*;
use js_sys::{Object, Reflect};

#[wasm_bindgen]
pub struct Owned {
    value: JsValue,
    consumed: bool,
}

#[wasm_bindgen]
impl Owned {
    #[wasm_bindgen(constructor)]
    pub fn new(value: JsValue) -> Owned {
        Owned {
            value,
            consumed: false,
        }
    }

    #[wasm_bindgen(js_name = "consume")]
    pub fn consume(&mut self) -> Result<JsValue, JsValue> {
        if self.consumed {
            let error = Object::new();
            Reflect::set(&error, &"name".into(), &"OwnershipError".into())?;
            Reflect::set(&error, &"message".into(), &"Value has already been consumed".into())?;
            return Err(error.into());
        }

        self.consumed = true;
        let value = self.value.clone();
        self.value = JsValue::null();
        Ok(value)
    }

    #[wasm_bindgen(js_name = "borrow")]
    pub fn borrow(&self, fn_callback: &js_sys::Function) -> Result<JsValue, JsValue> {
        if self.consumed {
            let error = Object::new();
            Reflect::set(&error, &"name".into(), &"OwnershipError".into())?;
            Reflect::set(&error, &"message".into(), &"Cannot borrow consumed value".into())?;
            return Err(error.into());
        }

        fn_callback.call1(&JsValue::null(), &self.value)
    }

    #[wasm_bindgen(js_name = "borrowMut")]
    pub fn borrow_mut(&self, fn_callback: &js_sys::Function) -> Result<JsValue, JsValue> {
        if self.consumed {
            let error = Object::new();
            Reflect::set(&error, &"name".into(), &"OwnershipError".into())?;
            Reflect::set(&error, &"message".into(), &"Cannot borrow consumed value".into())?;
            return Err(error.into());
        }

        fn_callback.call1(&JsValue::null(), &self.value)
    }

    #[wasm_bindgen(js_name = "isConsumed")]
    pub fn is_consumed(&self) -> bool {
        self.consumed
    }
    
    #[wasm_bindgen(js_name = "isAlive")]
    pub fn is_alive(&self) -> bool {
        !self.consumed
    }

    #[wasm_bindgen(js_name = "toString")]
    pub fn to_string(&self) -> String {
        if self.consumed {
            "[Owned consumed]".to_string()
        } else {
            "[Owned active]".to_string()
        }
    }
}

#[wasm_bindgen(js_name = "createOwned")]
pub fn create_owned(value: JsValue) -> Owned {
    Owned::new(value)
}