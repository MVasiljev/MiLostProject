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

    #[wasm_bindgen(js_name = withCapacity)]
    pub fn with_capacity(capacity: usize) -> Vec {
        Vec {
            inner: vec![0.0; capacity].into_boxed_slice(),
        }
    }

    #[wasm_bindgen(js_name = fromArray)]
    pub fn from_array(array: &js_sys::Array) -> Vec {
        let mut result = Vec::with_capacity(array.length() as usize);
        for i in 0..array.length() {
            if let Some(value) = array.get(i).as_f64() {
                result.push(value);
            }
        }
        result
    }

    #[wasm_bindgen]
    pub fn len(&self) -> usize {
        self.inner.len()
    }

    #[wasm_bindgen(js_name = isEmpty)]
    pub fn is_empty(&self) -> bool {
        self.inner.is_empty()
    }

    #[wasm_bindgen]
    pub fn push(&mut self, value: f64) {
        let mut vec = self.inner.to_vec();
        vec.push(value);
        self.inner = vec.into_boxed_slice();
    }

    #[wasm_bindgen]
    pub fn pop(&mut self) -> Option<f64> {
        let mut vec = self.inner.to_vec();
        let result = vec.pop();
        self.inner = vec.into_boxed_slice();
        result
    }

    #[wasm_bindgen]
    pub fn get(&self, index: usize) -> Option<f64> {
        if index < self.inner.len() {
            Some(self.inner[index])
        } else {
            None
        }
    }

    #[wasm_bindgen]
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

    #[wasm_bindgen(js_name = toArray)]
    pub fn to_array(&self) -> js_sys::Array {
        let result = js_sys::Array::new_with_length(self.inner.len() as u32);
        for (i, &value) in self.inner.iter().enumerate() {
            result.set(i as u32, JsValue::from_f64(value));
        }
        result
    }
}