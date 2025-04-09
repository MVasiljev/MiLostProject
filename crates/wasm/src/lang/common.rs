use wasm_bindgen::prelude::*;
use js_sys::{Array, Object, Reflect, Function, Symbol};
use super::Str;
use super::Vec as RustVec; 

#[wasm_bindgen]
pub struct LoadingStates {
    idle: Str,
    loading: Str,
    succeeded: Str,
    failed: Str,
}

#[wasm_bindgen]
impl LoadingStates {
    #[wasm_bindgen(constructor)]
    pub fn new() -> LoadingStates {
        LoadingStates {
            idle: Str::new("idle"),
            loading: Str::new("loading"),
            succeeded: Str::new("succeeded"),
            failed: Str::new("failed"),
        }
    }

    #[wasm_bindgen(getter)]
    pub fn idle(&self) -> Str {
        self.idle.clone()
    }

    #[wasm_bindgen(getter)]
    pub fn loading(&self) -> Str {
        self.loading.clone()
    }

    #[wasm_bindgen(getter)]
    pub fn succeeded(&self) -> Str {
        self.succeeded.clone()
    }

    #[wasm_bindgen(getter)]
    pub fn failed(&self) -> Str {
        self.failed.clone()
    }
}

#[wasm_bindgen]
pub struct BrandTypes {
    json: Str,
    positive: Str,
    negative: Str,
    non_negative: Str,
    percentage: Str,
}

#[wasm_bindgen]
impl BrandTypes {
    #[wasm_bindgen(constructor)]
    pub fn new() -> BrandTypes {
        BrandTypes {
            json: Str::new("Json"),
            positive: Str::new("Positive"),
            negative: Str::new("Negative"),
            non_negative: Str::new("NonNegative"),
            percentage: Str::new("Percentage"),
        }
    }

    #[wasm_bindgen(getter, js_name = JSON)]
    pub fn json(&self) -> Str {
        self.json.clone()
    }

    #[wasm_bindgen(getter, js_name = POSITIVE)]
    pub fn positive(&self) -> Str {
        self.positive.clone()
    }

    #[wasm_bindgen(getter, js_name = NEGATIVE)]
    pub fn negative(&self) -> Str {
        self.negative.clone()
    }

    #[wasm_bindgen(getter, js_name = NON_NEGATIVE)]
    pub fn non_negative(&self) -> Str {
        self.non_negative.clone()
    }

    #[wasm_bindgen(getter, js_name = PERCENTAGE)]
    pub fn percentage(&self) -> Str {
        self.percentage.clone()
    }
}

#[wasm_bindgen(js_name = "isDefined")]
pub fn is_defined(value: &JsValue) -> bool {
    !value.is_null() && !value.is_undefined()
}

#[wasm_bindgen(js_name = "isObject")]
pub fn is_object(value: &JsValue) -> bool {
    value.is_object() && !value.is_null() && !is_vec(value)
}

#[wasm_bindgen(js_name = "isVec")]
pub fn is_vec(value: &JsValue) -> bool {
    if !value.is_object() {
        return false;
    }
    
    let symbol_to_string_tag = Symbol::to_string_tag();
    if let Ok(tag) = Reflect::get(value, &symbol_to_string_tag.into()) {
        if let Some(tag_str) = tag.as_string() {
            return tag_str == "Vec";
        }
    }
    
    false
}

#[wasm_bindgen(js_name = "isStr")]
pub fn is_str(value: &JsValue) -> bool {
    if !value.is_object() {
        return false;
    }
    
    let symbol_to_string_tag = Symbol::to_string_tag();
    if let Ok(tag) = Reflect::get(value, &symbol_to_string_tag.into()) {
        if let Some(tag_str) = tag.as_string() {
            return tag_str == "Str";
        }
    }
    
    false
}

#[wasm_bindgen(js_name = "isNumeric")]
pub fn is_numeric(value: &JsValue) -> bool {
    if let Some(num_value) = value.as_f64() {
        if num_value.is_nan() {
            return false;
        }
        
        if num_value.trunc() == num_value {
            let int_value = num_value as i64;
            if int_value >= 0 && int_value <= 4294967295 {
                return true;
            }
            if int_value >= -2147483648 && int_value <= 2147483647 {
                return true;
            }
        }
        
        if num_value.is_finite() {
            return true;
        }
    }
    
    false
}

#[wasm_bindgen(js_name = "isBoolean")]
pub fn is_boolean(value: &JsValue) -> bool {
    value.as_bool().is_some()
}

#[wasm_bindgen(js_name = "isFunction")]
pub fn is_function(value: &JsValue) -> bool {
    Function::instanceof(value)
}

#[wasm_bindgen(js_name = "identity")]
pub fn identity(value: &JsValue) -> JsValue {
    value.clone()
}

#[wasm_bindgen(js_name = "iterableToVec")]
pub fn iterable_to_vec(iterable: &JsValue) -> Result<RustVec, JsValue> {
    let symbol_iterator = Symbol::iterator();
    let iterator_method = Reflect::get(iterable, &symbol_iterator.into())?;
    let iterator = Reflect::apply(&iterator_method.dyn_into::<Function>()?, iterable, &Array::new())?;
    
    let array = Array::new();
    
    loop {
        let next_result = Reflect::apply(
            &Reflect::get(&iterator, &JsValue::from_str("next"))?.dyn_into::<Function>()?,
            &iterator,
            &Array::new(),
        )?;
        
        let done = Reflect::get(&next_result, &JsValue::from_str("done"))?;
        if done.is_truthy() {
            break;
        }
        
        let value = Reflect::get(&next_result, &JsValue::from_str("value"))?;
        array.push(&value);
    }
    
    Ok(RustVec::from_array(&array))
}

#[wasm_bindgen(js_name = "createTypes")]
pub fn create_types() -> Result<Object, JsValue> {
    let types = Object::new();
    
    Reflect::set(&types, &JsValue::from_str("isDefined"), &Function::new_with_args("value", "return (value !== null && value !== undefined)"))?;
    Reflect::set(&types, &JsValue::from_str("isObject"), &Function::new_with_args("value", "return (typeof value === 'object' && value !== null && !this.isVec(value))"))?;
    Reflect::set(&types, &JsValue::from_str("isVec"), &Function::new_with_args("value", "return (value && value[Symbol.toStringTag] === 'Vec')"))?;
    Reflect::set(&types, &JsValue::from_str("isStr"), &Function::new_with_args("value", "return (value && value[Symbol.toStringTag] === 'Str')"))?;
    Reflect::set(&types, &JsValue::from_str("isNumeric"), &Function::new_with_args("value", "if (typeof value !== 'number' || Number.isNaN(value)) return false; if (Number.isInteger(value)) { if (value >= 0 && value <= 4294967295) return true; if (value >= -2147483648 && value <= 2147483647) return true; } if (Number.isFinite(value)) return true; return false;"))?;
    Reflect::set(&types, &JsValue::from_str("isBoolean"), &Function::new_with_args("value", "return typeof value === 'boolean'"))?;
    Reflect::set(&types, &JsValue::from_str("isFunction"), &Function::new_with_args("value", "return typeof value === 'function'"))?;
    Reflect::set(&types, &JsValue::from_str("identity"), &Function::new_with_args("value", "return value"))?;
    
    let iterable_to_vec_fn = Function::new_with_args(
        "iterable", 
        "return this.wasmInstance.iterableToVec(iterable)"
    );
    
    Reflect::set(&types, &JsValue::from_str("iterableToVec"), &iterable_to_vec_fn)?;
    
    Ok(types)
}