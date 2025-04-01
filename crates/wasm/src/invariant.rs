use wasm_bindgen::prelude::*;
use js_sys::{Function, Object, Reflect};

#[wasm_bindgen]
pub struct Invariant {
    value: JsValue,
}

#[wasm_bindgen]
impl Invariant {
    #[wasm_bindgen(constructor)]
    pub fn new(
        value: JsValue,
        invariant_fn: Function,
        error_msg: Option<String>,
    ) -> Result<Invariant, JsValue> {
        let error_message = error_msg.unwrap_or_else(|| "Invariant violated".to_string());
        
        // Check the invariant before creating
        let check_result = invariant_fn.call1(&JsValue::null(), &value)?;
        if !check_result.as_bool().unwrap_or(false) {
            let error = Object::new();
            Reflect::set(&error, &"name".into(), &"ContractError".into())?;
            Reflect::set(&error, &"message".into(), &error_message.clone().into())?;
            return Err(error.into());
        }
        
        Ok(Invariant {
            value
        })
    }

    #[wasm_bindgen(js_name = "get")]
    pub fn get(&self) -> JsValue {
        self.value.clone()
    }

    #[wasm_bindgen(js_name = "map")]
    pub fn map(
        &self,
        map_fn: &Function,
        new_invariant_fn: &Function,
        error_msg: Option<String>,
    ) -> Result<Invariant, JsValue> {
        // Apply the mapping function
        let new_value = map_fn.call1(&JsValue::null(), &self.value)?;
        
        // Create a new invariant with the mapped value
        Invariant::new(new_value, new_invariant_fn.clone(), error_msg)
    }

    #[wasm_bindgen(js_name = "toString")]
    pub fn to_string(&self) -> String {
        "[Invariant]".to_string()
    }
}

#[wasm_bindgen(js_name = "createInvariant")]
pub fn create_invariant(
    value: JsValue,
    invariant_fn: Function,
    error_msg: Option<String>,
) -> Result<Invariant, JsValue> {
    Invariant::new(value, invariant_fn, error_msg)
}