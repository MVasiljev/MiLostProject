use wasm_bindgen::prelude::*;
use js_sys::{Object, Array, Reflect, Function};

#[wasm_bindgen]
pub struct Struct {
    fields: Object,
}

#[wasm_bindgen]
impl Struct {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Struct {
        Struct {
            fields: Object::new(),
        }
    }

    #[wasm_bindgen(js_name = "from")]
    pub fn from_object(obj: &Object) -> Struct {
        let new_obj = Object::new();
        let keys = Object::keys(obj);
        
        for i in 0..keys.length() {
            let key = keys.get(i);
            let value = Reflect::get(obj, &key).unwrap_or(JsValue::UNDEFINED);
            Reflect::set(&new_obj, &key, &value).unwrap();
        }
        
        Struct {
            fields: new_obj,
        }
    }

    #[wasm_bindgen(js_name = "empty")]
    pub fn empty() -> Struct {
        Struct {
            fields: Object::new(),
        }
    }

    #[wasm_bindgen]
    pub fn get(&self, key: &str) -> JsValue {
        Reflect::get(&self.fields, &JsValue::from_str(key)).unwrap_or(JsValue::UNDEFINED)
    }

    #[wasm_bindgen]
    pub fn set(&self, key: &str, value: &JsValue) -> Struct {
        let new_fields = Object::new();
        let keys = Object::keys(&self.fields);
        
        for i in 0..keys.length() {
            let existing_key = keys.get(i);
            let existing_value = Reflect::get(&self.fields, &existing_key).unwrap_or(JsValue::UNDEFINED);
            Reflect::set(&new_fields, &existing_key, &existing_value).unwrap();
        }
        
        Reflect::set(&new_fields, &JsValue::from_str(key), value).unwrap();
        
        Struct {
            fields: new_fields,
        }
    }

    #[wasm_bindgen]
    pub fn keys(&self) -> Array {
        Object::keys(&self.fields)
    }

    #[wasm_bindgen]
    pub fn entries(&self) -> Array {
        let result = Array::new();
        let keys = Object::keys(&self.fields);
        
        for i in 0..keys.length() {
            let key = keys.get(i);
            let value = Reflect::get(&self.fields, &key).unwrap_or(JsValue::UNDEFINED);
            
            let entry = Array::new();
            entry.push(&key);
            entry.push(&value);
            
            result.push(&entry);
        }
        
        result
    }

    #[wasm_bindgen(js_name = "toObject")]
    pub fn to_object(&self) -> Object {
        let result = Object::new();
        let keys = Object::keys(&self.fields);
        
        for i in 0..keys.length() {
            let key = keys.get(i);
            let value = Reflect::get(&self.fields, &key).unwrap_or(JsValue::UNDEFINED);
            Reflect::set(&result, &key, &value).unwrap();
        }
        
        result
    }
    
    #[wasm_bindgen(js_name = "map")]
    pub fn map(&self, fn_val: &JsValue) -> Result<Struct, JsValue> {
        let fn_obj = fn_val.dyn_ref::<Function>().ok_or_else(|| {
            JsValue::from_str("Expected a function")
        })?;
        
        let new_fields = Object::new();
        let keys = Object::keys(&self.fields);
        
        for i in 0..keys.length() {
            let key = keys.get(i);
            let value = Reflect::get(&self.fields, &key).unwrap_or(JsValue::UNDEFINED);
            
            let args = js_sys::Array::new();
            args.push(&value);
            args.push(&key);
            
            let mapped_value = fn_obj.apply(&JsValue::NULL, &args)?;
            Reflect::set(&new_fields, &key, &mapped_value).unwrap();
        }
        
        Ok(Struct { fields: new_fields })
    }
    
    #[wasm_bindgen(js_name = "filter")]
    pub fn filter(&self, fn_val: &JsValue) -> Result<Struct, JsValue> {
        let fn_obj = fn_val.dyn_ref::<Function>().ok_or_else(|| {
            JsValue::from_str("Expected a function")
        })?;
        
        let new_fields = Object::new();
        let keys = Object::keys(&self.fields);
        
        for i in 0..keys.length() {
            let key = keys.get(i);
            let value = Reflect::get(&self.fields, &key).unwrap_or(JsValue::UNDEFINED);
            
            let args = js_sys::Array::new();
            args.push(&value);
            args.push(&key);
            
            let keep = fn_obj.apply(&JsValue::NULL, &args)?;
            
            if keep.is_truthy() {
                Reflect::set(&new_fields, &key, &value).unwrap();
            }
        }
        
        Ok(Struct { fields: new_fields })
    }
    
    #[wasm_bindgen(js_name = "forEach")]
    pub fn for_each(&self, fn_val: &JsValue) -> Result<(), JsValue> {
        let fn_obj = fn_val.dyn_ref::<Function>().ok_or_else(|| {
            JsValue::from_str("Expected a function")
        })?;
        
        let keys = Object::keys(&self.fields);
        
        for i in 0..keys.length() {
            let key = keys.get(i);
            let value = Reflect::get(&self.fields, &key).unwrap_or(JsValue::UNDEFINED);
            
            let args = js_sys::Array::new();
            args.push(&value);
            args.push(&key);
            
            fn_obj.apply(&JsValue::NULL, &args)?;
        }
        
        Ok(())
    }
    
    #[wasm_bindgen(js_name = "toString")]
    pub fn to_string_js(&self) -> String {
        format!("[Struct {}]", self.keys().length())
    }
}