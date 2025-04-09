use wasm_bindgen::prelude::*;
use js_sys::{Object, Array, Reflect};

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

    #[wasm_bindgen(js_name = fromObject)]
    pub fn from_object(obj: &Object) -> Struct {
        let new_obj = Object::new();
        let keys = Object::keys(obj);
        
        for i in 0..keys.length() {
            let key = keys.get(i);
            let _key_str = key.as_string().unwrap_or_default();
            let value = Reflect::get(obj, &key).unwrap_or(JsValue::UNDEFINED);
            Reflect::set(&new_obj, &key, &value).unwrap();
        }
        
        Struct {
            fields: new_obj,
        }
    }

    #[wasm_bindgen(js_name = empty)]
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
            let _existing_key_str = existing_key.as_string().unwrap_or_default();
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

    #[wasm_bindgen(js_name = toObject)]
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
}