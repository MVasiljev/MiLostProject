use js_sys::{Array, Function};
use wasm_bindgen::prelude::*;
use wasm_bindgen::JsCast;

#[wasm_bindgen(js_name = "Vec")]
pub struct VecF64 {
    inner: std::vec::Vec<f64>,
}

#[wasm_bindgen]
impl VecF64 {
    #[wasm_bindgen(constructor)]
    pub fn new() -> VecF64 {
        VecF64 { inner: vec![] }
    }

    #[wasm_bindgen(js_name = "withCapacity")]
    pub fn with_capacity(capacity: usize) -> VecF64 {
        VecF64 {
            inner: vec![0.0; capacity],
        }
    }

    #[wasm_bindgen(js_name = "from")]
    pub fn from_array(arr: &Array) -> VecF64 {
        let mut inner = VecF64::new();
        for val in arr.iter() {
            if let Some(n) = val.as_f64() {
                inner.inner.push(n);
            }
        }
        inner
    }

    #[wasm_bindgen(js_name = "empty")]
    pub fn empty() -> VecF64 {
        VecF64::new()
    }

    #[wasm_bindgen(js_name = "find")]
    pub fn find(&self, fn_val: &JsValue) -> Result<JsValue, JsValue> {
        let fn_obj = fn_val.dyn_ref::<Function>().ok_or_else(|| JsValue::from_str("Expected a function"))?;
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
        let fn_obj = fn_val.dyn_ref::<Function>().ok_or_else(|| JsValue::from_str("Expected a function"))?;
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
    pub fn map(&self, fn_val: &JsValue) -> Result<VecF64, JsValue> {
        let fn_obj = fn_val.dyn_ref::<Function>().ok_or_else(|| JsValue::from_str("Expected a function"))?;
        let result = js_sys::Array::new_with_length(self.inner.len() as u32);
        for (i, &value) in self.inner.iter().enumerate() {
            let args = js_sys::Array::new();
            args.push(&JsValue::from_f64(value));
            args.push(&JsValue::from_f64(i as f64));
            let mapped_value = fn_obj.apply(&JsValue::NULL, &args)?;
            result.set(i as u32, mapped_value);
        }
        Ok(VecF64::from_array(&result))
    }

    #[wasm_bindgen(js_name = "filter")]
    pub fn filter(&self, fn_val: &JsValue) -> Result<VecF64, JsValue> {
        let fn_obj = fn_val.dyn_ref::<Function>().ok_or_else(|| JsValue::from_str("Expected a function"))?;
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
        Ok(VecF64::from_array(&result))
    }

    #[wasm_bindgen(js_name = "reverse")]
    pub fn reverse(&self) -> VecF64 {
        let mut new_data = self.inner.clone();
        new_data.reverse();
        VecF64 { inner: new_data }
    }

    #[wasm_bindgen(js_name = "all")]
    pub fn all(&self, fn_val: &JsValue) -> Result<bool, JsValue> {
        let fn_obj = fn_val.dyn_ref::<Function>().ok_or_else(|| JsValue::from_str("Expected a function"))?;
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
        let fn_obj = fn_val.dyn_ref::<Function>().ok_or_else(|| JsValue::from_str("Expected a function"))?;
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
    pub fn take(&self, n: usize) -> VecF64 {
        let count = n.min(self.inner.len());
        VecF64 { inner: self.inner[0..count].to_vec() }
    }

    #[wasm_bindgen(js_name = "drop")]
    pub fn drop(&self, n: usize) -> VecF64 {
        let count = n.min(self.inner.len());
        VecF64 { inner: self.inner[count..].to_vec() }
    }

    #[wasm_bindgen(js_name = "concat")]
    pub fn concat(&self, other: &VecF64) -> VecF64 {
        let mut new_data = self.inner.clone();
        new_data.extend_from_slice(&other.inner);
        VecF64 { inner: new_data }
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
        self.inner.push(value);
    }

    #[wasm_bindgen(js_name = "pop")]
    pub fn pop(&mut self) -> Option<f64> {
        self.inner.pop()
    }

    #[wasm_bindgen(js_name = "get")]
    pub fn get(&self, index: usize) -> Option<f64> {
        self.inner.get(index).copied()
    }

    #[wasm_bindgen(js_name = "set")]
    pub fn set(&mut self, index: usize, value: f64) -> Result<(), JsValue> {
        if let Some(slot) = self.inner.get_mut(index) {
            *slot = value;
            Ok(())
        } else {
            Err(JsValue::from_str(&format!("Index out of bounds: {}", index)))
        }
    }

    #[wasm_bindgen(js_name = "toArray")]
    pub fn to_array(&self) -> js_sys::Array {
        self.inner.iter().map(|&v| JsValue::from_f64(v)).collect()
    }

    #[wasm_bindgen(js_name = "forEach")]
    pub fn for_each(&self, fn_val: &JsValue) -> Result<(), JsValue> {
        let fn_obj = fn_val.dyn_ref::<Function>().ok_or_else(|| JsValue::from_str("Expected a function"))?;
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
