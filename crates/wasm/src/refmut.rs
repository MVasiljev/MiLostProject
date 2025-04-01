use wasm_bindgen::prelude::*;
use js_sys::{Object, Function, Reflect};

#[wasm_bindgen]
pub struct RefMut {
    value: JsValue,
    active: bool,
}

#[wasm_bindgen]
impl RefMut {
    #[wasm_bindgen(constructor)]
    pub fn new(value: JsValue) -> RefMut {
        RefMut {
            value,
            active: true,
        }
    }

    #[wasm_bindgen(js_name = "get")]
    pub fn get(&self) -> Result<JsValue, JsValue> {
        if !self.active {
            let error = Object::new();
            Reflect::set(&error, &"name".into(), &"OwnershipError".into())?;
            Reflect::set(&error, &"message".into(), &"Mutable reference is no longer valid".into())?;
            return Err(error.into());
        }
        Ok(self.value.clone())
    }

    #[wasm_bindgen(js_name = "set")]
    pub fn set(&mut self, updater: &Function) -> Result<(), JsValue> {
        if !self.active {
            let error = Object::new();
            Reflect::set(&error, &"name".into(), &"OwnershipError".into())?;
            Reflect::set(&error, &"message".into(), &"Mutable reference is no longer valid".into())?;
            return Err(error.into());
        }
        
        let new_value = updater.call1(&JsValue::null(), &self.value)?;
        
        self.value = new_value;
        
        Ok(())
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
            "[RefMut active]".to_string()
        } else {
            "[RefMut dropped]".to_string()
        }
    }
}

#[wasm_bindgen(js_name = "createRefMut")]
pub fn create_ref_mut(value: JsValue) -> RefMut {
    RefMut::new(value)
}