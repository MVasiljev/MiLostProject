use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct Tuple {
    values: Box<[JsValue]>,
}

#[wasm_bindgen]
impl Tuple {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Tuple {
        Tuple {
            values: Box::new([]),
        }
    }

    #[wasm_bindgen(js_name = "from")]
    pub fn from_array(array: &js_sys::Array) -> Tuple {
        let mut values = Vec::with_capacity(array.length() as usize);
        for i in 0..array.length() {
            values.push(array.get(i));
        }
        Tuple {
            values: values.into_boxed_slice(),
        }
    }
    
    #[wasm_bindgen(js_name = "pair")]
    pub fn pair(a: &JsValue, b: &JsValue) -> Tuple {
        Tuple {
            values: Box::new([a.clone(), b.clone()]),
        }
    }

    #[wasm_bindgen]
    pub fn len(&self) -> usize {
        self.values.len()
    }
    
    #[wasm_bindgen(js_name = "isEmpty")]
    pub fn is_empty(&self) -> bool {
        self.values.is_empty()
    }

    #[wasm_bindgen]
    pub fn get(&self, index: usize) -> Result<JsValue, JsValue> {
        if index < self.values.len() {
            Ok(self.values[index].clone())
        } else {
            Err(JsValue::from_str(&format!("Index out of bounds: {} >= {}", index, self.values.len())))
        }
    }

    #[wasm_bindgen]
    pub fn replace(&self, index: usize, value: JsValue) -> Result<Tuple, JsValue> {
        if index < self.values.len() {
            let mut new_values = self.values.to_vec();
            new_values[index] = value;
            Ok(Tuple {
                values: new_values.into_boxed_slice(),
            })
        } else {
            Err(JsValue::from_str(&format!("Index out of bounds: {} >= {}", index, self.values.len())))
        }
    }

    #[wasm_bindgen]
    pub fn first(&self) -> Result<JsValue, JsValue> {
        self.get(0)
    }

    #[wasm_bindgen]
    pub fn second(&self) -> Result<JsValue, JsValue> {
        self.get(1)
    }
    
    #[wasm_bindgen(js_name = "map")]
    pub fn map(&self, fn_val: &JsValue) -> Result<Tuple, JsValue> {
        let fn_obj = fn_val.dyn_ref::<js_sys::Function>().ok_or_else(|| {
            JsValue::from_str("Expected a function")
        })?;
        
        let result = js_sys::Array::new_with_length(self.values.len() as u32);
        
        for (i, value) in self.values.iter().enumerate() {
            let args = js_sys::Array::new();
            args.push(value);
            args.push(&JsValue::from_f64(i as f64));
            
            let mapped_value = fn_obj.apply(&JsValue::NULL, &args)?;
            result.set(i as u32, mapped_value);
        }
        
        Ok(Tuple::from_array(&result))
    }
    
    #[wasm_bindgen(js_name = "forEach")]
    pub fn for_each(&self, fn_val: &JsValue) -> Result<(), JsValue> {
        let fn_obj = fn_val.dyn_ref::<js_sys::Function>().ok_or_else(|| {
            JsValue::from_str("Expected a function")
        })?;
        
        for (i, value) in self.values.iter().enumerate() {
            let args = js_sys::Array::new();
            args.push(value);
            args.push(&JsValue::from_f64(i as f64));
            
            fn_obj.apply(&JsValue::NULL, &args)?;
        }
        
        Ok(())
    }

    #[wasm_bindgen(js_name = "toArray")]
    pub fn to_array(&self) -> js_sys::Array {
        let result = js_sys::Array::new_with_length(self.values.len() as u32);
        for (i, value) in self.values.iter().enumerate() {
            result.set(i as u32, value.clone());
        }
        result
    }
    
    #[wasm_bindgen(js_name = "toString")]
    pub fn to_string_js(&self) -> String {
        format!("[Tuple {}]", self.values.len())
    }
}