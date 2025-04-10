use wasm_bindgen::prelude::*;
use js_sys::{Array, Function, Map};

#[wasm_bindgen]
pub struct HashMap {
    map: Map,
}

#[wasm_bindgen]
impl HashMap {
    #[wasm_bindgen(constructor)]
    pub fn new() -> HashMap {
        HashMap {
            map: Map::new(),
        }
    }

    #[wasm_bindgen(js_name = "from")]
    pub fn from_entries(entries: &js_sys::Array) -> HashMap {
        let map = Map::new();
        
        for i in 0..entries.length() {
            let entry = entries.get(i);
            if let Some(entry_array) = entry.dyn_ref::<js_sys::Array>() {
                if entry_array.length() >= 2 {
                    let key = entry_array.get(0);
                    let value = entry_array.get(1);
                    map.set(&key, &value);
                }
            }
        }
        
        HashMap { map }
    }

    #[wasm_bindgen(js_name = "map")]
    pub fn map(&self, fn_val: &JsValue) -> Result<HashMap, JsValue> {
        let fn_obj = fn_val.dyn_ref::<Function>().ok_or_else(|| {
            JsValue::from_str("Expected a function")
        })?;
        
        let new_map = Map::new();
        let entries_iter = self.map.entries();
        
        loop {
            let next_result = entries_iter.next();
            if let Ok(iter_next) = next_result {
                if iter_next.done() {
                    break;
                }
                
                if let Some(entry_array) = iter_next.value().dyn_ref::<js_sys::Array>() {
                    if entry_array.length() >= 2 {
                        let k = entry_array.get(0);
                        let v = entry_array.get(1);
                        
                        let args = js_sys::Array::new();
                        args.push(&v);
                        args.push(&k);
                        
                        let result = fn_obj.apply(&JsValue::NULL, &args)?;
                        new_map.set(&k, &result);
                    }
                }
            } else {
                break;
            }
        }
        
        Ok(HashMap { map: new_map })
    }
    
    #[wasm_bindgen(js_name = "filter")]
    pub fn filter(&self, fn_val: &JsValue) -> Result<HashMap, JsValue> {
        let fn_obj = fn_val.dyn_ref::<Function>().ok_or_else(|| {
            JsValue::from_str("Expected a function")
        })?;
        
        let new_map = Map::new();
        let entries_iter = self.map.entries();
        
        loop {
            let next_result = entries_iter.next();
            if let Ok(iter_next) = next_result {
                if iter_next.done() {
                    break;
                }
                
                if let Some(entry_array) = iter_next.value().dyn_ref::<js_sys::Array>() {
                    if entry_array.length() >= 2 {
                        let k = entry_array.get(0);
                        let v = entry_array.get(1);
                        
                        let args = js_sys::Array::new();
                        args.push(&v);
                        args.push(&k);
                        
                        let result = fn_obj.apply(&JsValue::NULL, &args)?;
                        
                        if result.is_truthy() {
                            new_map.set(&k, &v);
                        }
                    }
                }
            } else {
                break;
            }
        }
        
        Ok(HashMap { map: new_map })
    }
    
    #[wasm_bindgen(js_name = "find")]
    pub fn find(&self, fn_val: &JsValue) -> Result<JsValue, JsValue> {
        let fn_obj = fn_val.dyn_ref::<Function>().ok_or_else(|| {
            JsValue::from_str("Expected a function")
        })?;
        
        let entries_iter = self.map.entries();
        
        loop {
            let next_result = entries_iter.next();
            if let Ok(iter_next) = next_result {
                if iter_next.done() {
                    break;
                }
                
                if let Some(entry_array) = iter_next.value().dyn_ref::<js_sys::Array>() {
                    if entry_array.length() >= 2 {
                        let k = entry_array.get(0);
                        let v = entry_array.get(1);
                        
                        let args = js_sys::Array::new();
                        args.push(&v);
                        args.push(&k);
                        
                        let result = fn_obj.apply(&JsValue::NULL, &args)?;
                        
                        if result.is_truthy() {
                            return Ok(entry_array.into());
                        }
                    }
                }
            } else {
                break;
            }
        }
        
        Ok(JsValue::UNDEFINED)
    }
    
    #[wasm_bindgen(js_name = "forEach")]
    pub fn for_each(&self, fn_val: &JsValue) -> Result<(), JsValue> {
        let fn_obj = fn_val.dyn_ref::<Function>().ok_or_else(|| {
            JsValue::from_str("Expected a function")
        })?;
        
        let entries_iter = self.map.entries();
        
        loop {
            let next_result = entries_iter.next();
            if let Ok(iter_next) = next_result {
                if iter_next.done() {
                    break;
                }
                
                if let Some(entry_array) = iter_next.value().dyn_ref::<js_sys::Array>() {
                    if entry_array.length() >= 2 {
                        let k = entry_array.get(0);
                        let v = entry_array.get(1);
                        
                        let args = js_sys::Array::new();
                        args.push(&v);
                        args.push(&k);
                        
                        fn_obj.apply(&JsValue::NULL, &args)?;
                    }
                }
            } else {
                break;
            }
        }
        
        Ok(())
    }

    #[wasm_bindgen(js_name = "empty")]
    pub fn empty() -> HashMap {
        HashMap::new()
    }

    #[wasm_bindgen]
    pub fn size(&self) -> usize {
        self.map.size() as usize
    }

    #[wasm_bindgen(js_name = "isEmpty")]
    pub fn is_empty(&self) -> bool {
        self.map.size() == 0
    }

    #[wasm_bindgen]
    pub fn get(&self, key: &JsValue) -> JsValue {
        self.map.get(key)
    }

    #[wasm_bindgen]
    pub fn contains(&self, key: &JsValue) -> bool {
        self.map.has(key)
    }

    #[wasm_bindgen]
    pub fn insert(&self, key: &JsValue, value: &JsValue) -> HashMap {
        let new_map = Map::new();
        
        let entries_iter = self.map.entries();
        loop {
            let next_result = entries_iter.next();
            if let Ok(iter_next) = next_result {
                if iter_next.done() {
                    break;
                }
                
                if let Some(entry_array) = iter_next.value().dyn_ref::<js_sys::Array>() {
                    if entry_array.length() >= 2 {
                        let k = entry_array.get(0);
                        let v = entry_array.get(1);
                        new_map.set(&k, &v);
                    }
                }
            } else {
                break;
            }
        }
        
        new_map.set(key, value);
        
        HashMap { map: new_map }
    }

    #[wasm_bindgen]
    pub fn remove(&self, key: &JsValue) -> HashMap {
        let new_map = Map::new();
        
        let entries_iter = self.map.entries();
        loop {
            let next_result = entries_iter.next();
            if let Ok(iter_next) = next_result {
                if iter_next.done() {
                    break;
                }
                
                if let Some(entry_array) = iter_next.value().dyn_ref::<js_sys::Array>() {
                    if entry_array.length() >= 2 {
                        let k = entry_array.get(0);
                        let v = entry_array.get(1);
                        
                        if !k.eq(key) {
                            new_map.set(&k, &v);
                        }
                    }
                }
            } else {
                break;
            }
        }
        
        HashMap { map: new_map }
    }

    #[wasm_bindgen]
    pub fn keys(&self) -> Array {
        let result = Array::new();
        
        let keys_iter = self.map.keys();
        loop {
            let next_result = keys_iter.next();
            if let Ok(iter_next) = next_result {
                if iter_next.done() {
                    break;
                }
                
                result.push(&iter_next.value());
            } else {
                break;
            }
        }
        
        result
    }

    #[wasm_bindgen]
    pub fn values(&self) -> Array {
        let result = Array::new();
        
        let values_iter = self.map.values();
        loop {
            let next_result = values_iter.next();
            if let Ok(iter_next) = next_result {
                if iter_next.done() {
                    break;
                }
                
                result.push(&iter_next.value());
            } else {
                break;
            }
        }
        
        result
    }

    #[wasm_bindgen]
    pub fn entries(&self) -> Array {
        let result = Array::new();
        
        let entries_iter = self.map.entries();
        loop {
            let next_result = entries_iter.next();
            if let Ok(iter_next) = next_result {
                if iter_next.done() {
                    break;
                }
                
                result.push(&iter_next.value());
            } else {
                break;
            }
        }
        
        result
    }

    #[wasm_bindgen]
    pub fn extend(&self, other: &HashMap) -> HashMap {
        let new_map = Map::new();
        
        let entries_iter = self.map.entries();
        loop {
            let next_result = entries_iter.next();
            if let Ok(iter_next) = next_result {
                if iter_next.done() {
                    break;
                }
                
                if let Some(entry_array) = iter_next.value().dyn_ref::<js_sys::Array>() {
                    if entry_array.length() >= 2 {
                        let k = entry_array.get(0);
                        let v = entry_array.get(1);
                        new_map.set(&k, &v);
                    }
                }
            } else {
                break;
            }
        }
        
        let other_entries_iter = other.map.entries();
        loop {
            let next_result = other_entries_iter.next();
            if let Ok(iter_next) = next_result {
                if iter_next.done() {
                    break;
                }
                
                if let Some(entry_array) = iter_next.value().dyn_ref::<js_sys::Array>() {
                    if entry_array.length() >= 2 {
                        let k = entry_array.get(0);
                        let v = entry_array.get(1);
                        new_map.set(&k, &v);
                    }
                }
            } else {
                break;
            }
        }
        
        HashMap { map: new_map }
    }

    #[wasm_bindgen]
    pub fn clear(&self) -> HashMap {
        HashMap::new()
    }

    #[wasm_bindgen(js_name = "toArray")]
    pub fn to_array(&self) -> Array {
        self.entries()
    }
    
    #[wasm_bindgen(js_name = "toString")]
    pub fn to_string_js(&self) -> String {
        format!("[HashMap size={}]", self.size())
    }
}