use js_sys::Function;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct Vec {
    inner: Box<[f64]>,
}

#[wasm_bindgen]
impl Vec {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Vec {
        Vec {
            inner: Box::new([]),
        }
    }

    #[wasm_bindgen(js_name = "withCapacity")]
    pub fn with_capacity(capacity: usize) -> Vec {
        Vec {
            inner: vec![0.0; capacity].into_boxed_slice(),
        }
    }

    #[wasm_bindgen(js_name = "from")]
    pub fn from_array(array: &js_sys::Array) -> Vec {
        let mut result = Vec::with_capacity(array.length() as usize);
        for i in 0..array.length() {
            if let Some(value) = array.get(i).as_f64() {
                result.push(value);
            }
        }
        result
    }

    #[wasm_bindgen(js_name = "empty")]
    pub fn empty() -> Vec {
        Vec::new()
    }

    #[wasm_bindgen(js_name = "find")]
    pub fn find(&self, fn_val: &JsValue) -> Result<JsValue, JsValue> {
        let fn_obj = fn_val.dyn_ref::<Function>().ok_or_else(|| {
            JsValue::from_str("Expected a function")
        })?;
        
        for (i, &value) in self.inner.iter().enumerate() {
            let args = js_sys::Array::new();
            args.push(&JsValue::from_f64(value));
            
            let result = fn_obj.apply(&JsValue::NULL, &args)?;
            
            if result.is_truthy() {
                return Ok(JsValue::from_f64(value));
            }
        }
        
        Ok(JsValue::UNDEFINED)
    }

    #[wasm_bindgen(js_name = "fold")]
    pub fn fold(&self, initial: &JsValue, fn_val: &JsValue) -> Result<JsValue, JsValue> {
        let fn_obj = fn_val.dyn_ref::<Function>().ok_or_else(|| {
            JsValue::from_str("Expected a function")
        })?;
        
        let mut acc = initial.clone();
        
        for (i, &value) in self.inner.iter().enumerate() {
            let args = js_sys::Array::new();
            args.push(&acc);
            args.push(&JsValue::from_f64(value));
            args.push(&JsValue::from_f64(i as f64));
            
            acc = fn_obj.apply(&JsValue::NULL, &args)?;
        }
        
        Ok(acc)
    }

    #[wasm_bindgen(js_name = "map")]
    pub fn map(&self, fn_val: &JsValue) -> Result<Vec, JsValue> {
        let fn_obj = fn_val.dyn_ref::<Function>().ok_or_else(|| {
            JsValue::from_str("Expected a function")
        })?;
        
        let result = js_sys::Array::new_with_length(self.inner.len() as u32);
        
        for (i, &value) in self.inner.iter().enumerate() {
            let args = js_sys::Array::new();
            args.push(&JsValue::from_f64(value));
            args.push(&JsValue::from_f64(i as f64));
            
            let mapped_value = fn_obj.apply(&JsValue::NULL, &args)?;
            result.set(i as u32, mapped_value);
        }
        
        Ok(Vec::from_array(&result))
    }

    #[wasm_bindgen(js_name = "filter")]
    pub fn filter(&self, fn_val: &JsValue) -> Result<Vec, JsValue> {
        let fn_obj = fn_val.dyn_ref::<Function>().ok_or_else(|| {
            JsValue::from_str("Expected a function")
        })?;
        
        let result = js_sys::Array::new();
        
        for (i, &value) in self.inner.iter().enumerate() {
            let args = js_sys::Array::new();
            args.push(&JsValue::from_f64(value));
            args.push(&JsValue::from_f64(i as f64));
            
            let keep = fn_obj.apply(&JsValue::NULL, &args)?;
            
            if keep.is_truthy() {
                result.push(&JsValue::from_f64(value));
            }
        }
        
        Ok(Vec::from_array(&result))
    }

    #[wasm_bindgen(js_name = "reverse")]
    pub fn reverse(&self) -> Vec {
        let mut new_data = self.inner.to_vec();
        new_data.reverse();
        
        Vec {
            inner: new_data.into_boxed_slice(),
        }
    }

    #[wasm_bindgen(js_name = "all")]
    pub fn all(&self, fn_val: &JsValue) -> Result<bool, JsValue> {
        let fn_obj = fn_val.dyn_ref::<Function>().ok_or_else(|| {
            JsValue::from_str("Expected a function")
        })?;
        
        for &value in self.inner.iter() {
            let args = js_sys::Array::new();
            args.push(&JsValue::from_f64(value));
            
            let result = fn_obj.apply(&JsValue::NULL, &args)?;
            
            if !result.is_truthy() {
                return Ok(false);
            }
        }
        
        Ok(true)
    }

    #[wasm_bindgen(js_name = "any")]
    pub fn any(&self, fn_val: &JsValue) -> Result<bool, JsValue> {
        let fn_obj = fn_val.dyn_ref::<Function>().ok_or_else(|| {
            JsValue::from_str("Expected a function")
        })?;
        
        for &value in self.inner.iter() {
            let args = js_sys::Array::new();
            args.push(&JsValue::from_f64(value));
            
            let result = fn_obj.apply(&JsValue::NULL, &args)?;
            
            if result.is_truthy() {
                return Ok(true);
            }
        }
        
        Ok(false)
    }

    #[wasm_bindgen(js_name = "take")]
    pub fn take(&self, n: usize) -> Vec {
        let count = n.min(self.inner.len());
        let new_data = self.inner[0..count].to_vec();
        
        Vec {
            inner: new_data.into_boxed_slice(),
        }
    }

    #[wasm_bindgen(js_name = "drop")]
    pub fn drop(&self, n: usize) -> Vec {
        let count = n.min(self.inner.len());
        let new_data = self.inner[count..].to_vec();
        
        Vec {
            inner: new_data.into_boxed_slice(),
        }
    }

    #[wasm_bindgen(js_name = "concat")]
    pub fn concat(&self, other: &Vec) -> Vec {
        let mut new_data = self.inner.to_vec();
        new_data.extend_from_slice(&other.inner);
        
        Vec {
            inner: new_data.into_boxed_slice(),
        }
    }

    #[wasm_bindgen(js_name = "len")]
    pub fn len(&self) -> usize {
        self.inner.len()
    }

    #[wasm_bindgen(js_name = "isEmpty")]
    pub fn is_empty(&self) -> bool {
        self.inner.is_empty()
    }

    #[wasm_bindgen(js_name = "push")]
    pub fn push(&mut self, value: f64) {
        let mut vec = self.inner.to_vec();
        vec.push(value);
        self.inner = vec.into_boxed_slice();
    }

    #[wasm_bindgen(js_name = "pop")]
    pub fn pop(&mut self) -> Option<f64> {
        let mut vec = self.inner.to_vec();
        let result = vec.pop();
        self.inner = vec.into_boxed_slice();
        result
    }

    #[wasm_bindgen(js_name = "get")]
    pub fn get(&self, index: usize) -> Option<f64> {
        if index < self.inner.len() {
            Some(self.inner[index])
        } else {
            None
        }
    }

    #[wasm_bindgen(js_name = "set")]
    pub fn set(&mut self, index: usize, value: f64) -> Result<(), JsValue> {
        if index < self.inner.len() {
            let mut vec = self.inner.to_vec();
            vec[index] = value;
            self.inner = vec.into_boxed_slice();
            Ok(())
        } else {
            Err(JsValue::from_str(&format!("Index out of bounds: {} >= {}", index, self.inner.len())))
        }
    }

    #[wasm_bindgen(js_name = "toArray")]
    pub fn to_array(&self) -> js_sys::Array {
        let result = js_sys::Array::new_with_length(self.inner.len() as u32);
        for (i, &value) in self.inner.iter().enumerate() {
            result.set(i as u32, JsValue::from_f64(value));
        }
        result
    }
    
    
    #[wasm_bindgen(js_name = "forEach")]
    pub fn for_each(&self, fn_val: &JsValue) -> Result<(), JsValue> {
        let fn_obj = fn_val.dyn_ref::<Function>().ok_or_else(|| {
            JsValue::from_str("Expected a function")
        })?;
        
        for (i, &value) in self.inner.iter().enumerate() {
            let args = js_sys::Array::new();
            args.push(&JsValue::from_f64(value));
            args.push(&JsValue::from_f64(i as f64));
            
            fn_obj.apply(&JsValue::NULL, &args)?;
        }
        
        Ok(())
    }
    
    #[wasm_bindgen(js_name = "toString")]
    pub fn to_string_js(&self) -> String {
        format!("[Vec len={}]", self.inner.len())
    }
}