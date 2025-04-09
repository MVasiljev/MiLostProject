use wasm_bindgen::prelude::*;
use js_sys::{Object, Reflect};

#[wasm_bindgen]
pub struct Ref {
    value: JsValue,
    active: bool,
}

#[wasm_bindgen]
impl Ref {
    #[wasm_bindgen(constructor)]
    pub fn new(value: JsValue) -> Ref {
        Ref {
            value,
            active: true,
        }
    }

    #[wasm_bindgen(js_name = "get")]
    pub fn get(&self) -> Result<JsValue, JsValue> {
        if !self.active {
            let error = Object::new();
            Reflect::set(&error, &"name".into(), &"OwnershipError".into())?;
            Reflect::set(&error, &"message".into(), &"Reference is no longer valid".into())?;
            return Err(error.into());
        }
        Ok(self.value.clone())
    }

    #[wasm_bindgen(js_name = "drop")]
    pub fn drop(&mut self) {
        self.active = false;
    }

    #[wasm_bindgen(js_name = "isActive")]
    pub fn is_active(&self) -> bool {
        self.active
    }

    #[wasm_bindgen(js_name = "toString")]
    pub fn to_string(&self) -> String {
        if self.active {
            "[Ref active]".to_string()
        } else {
            "[Ref dropped]".to_string()
        }
    }
}

#[wasm_bindgen(js_name = "createRef")]
pub fn create_ref(value: JsValue) -> Ref {
    Ref::new(value)
}