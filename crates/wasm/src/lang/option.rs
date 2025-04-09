use wasm_bindgen::prelude::*;
use js_sys::{Object, Function, Reflect};

#[wasm_bindgen]
pub struct Option {
    some: bool,
    value: JsValue,
}

#[wasm_bindgen]
impl Option {
    #[wasm_bindgen(constructor)]
    pub fn new(some: bool, value: JsValue) -> Option {
        Option { some, value }
    }

    #[wasm_bindgen(js_name = "isSome")]
    pub fn is_some(&self) -> bool {
        self.some
    }

    #[wasm_bindgen(js_name = "isNone")]
    pub fn is_none(&self) -> bool {
        !self.some
    }

    #[wasm_bindgen(js_name = "unwrap")]
    pub fn unwrap(&self) -> Result<JsValue, JsValue> {
        if self.some {
            Ok(self.value.clone())
        } else {
            let error = Object::new();
            Reflect::set(&error, &"message".into(), &"Called unwrap on a None value".into())?;
            Reflect::set(&error, &"name".into(), &"ValidationError".into())?;
            Err(error.into())
        }
    }

    #[wasm_bindgen(js_name = "unwrapOr")]
    pub fn unwrap_or(&self, default_value: JsValue) -> JsValue {
        if self.some {
            self.value.clone()
        } else {
            default_value
        }
    }

    #[wasm_bindgen(js_name = "unwrapOrElse")]
    pub fn unwrap_or_else(&self, default_fn: &Function) -> Result<JsValue, JsValue> {
        if self.some {
            Ok(self.value.clone())
        } else {
            default_fn.call0(&JsValue::NULL)
        }
    }

    #[wasm_bindgen(js_name = "map")]
    pub fn map(&self, mapper: &Function) -> Result<Option, JsValue> {
        if self.some {
            let mapped = mapper.call1(&JsValue::NULL, &self.value)?;
            Ok(Option::new(true, mapped))
        } else {
            Ok(Option::new(false, JsValue::undefined()))
        }
    }

    #[wasm_bindgen(js_name = "andThen")]
    pub fn and_then(&self, fn_val: &Function) -> Result<Option, JsValue> {
        if !self.some {
            return Ok(Option::new(false, JsValue::undefined()));
        }
        
        let result = fn_val.call1(&JsValue::NULL, &self.value)?;
        
        if !result.is_object() {
            let error = Object::new();
            Reflect::set(&error, &"message".into(), &"Function did not return an Option".into())?;
            Reflect::set(&error, &"name".into(), &"TypeError".into())?;
            return Err(error.into());
        }
        
        // Check if result has isSome method
        if !Reflect::has(&result, &"isSome".into())? {
            let error = Object::new();
            Reflect::set(&error, &"message".into(), &"Function did not return an Option".into())?;
            Reflect::set(&error, &"name".into(), &"TypeError".into())?;
            return Err(error.into());
        }
        
        let is_some_prop = Reflect::get(&result, &"isSome".into())?;
        if !is_some_prop.is_function() {
            let error = Object::new();
            Reflect::set(&error, &"message".into(), &"Function did not return an Option".into())?;
            Reflect::set(&error, &"name".into(), &"TypeError".into())?;
            return Err(error.into());
        }
        
        let is_some_fn = is_some_prop.dyn_ref::<Function>().unwrap();
        let is_some_result = is_some_fn.call0(&result)?;
        
        if is_some_result.is_truthy() {
            // Check if result has unwrap method
            if !Reflect::has(&result, &"unwrap".into())? {
                let error = Object::new();
                Reflect::set(&error, &"message".into(), &"Option object missing unwrap method".into())?;
                Reflect::set(&error, &"name".into(), &"TypeError".into())?;
                return Err(error.into());
            }
            
            let unwrap_prop = Reflect::get(&result, &"unwrap".into())?;
            if !unwrap_prop.is_function() {
                let error = Object::new();
                Reflect::set(&error, &"message".into(), &"Option object missing unwrap method".into())?;
                Reflect::set(&error, &"name".into(), &"TypeError".into())?;
                return Err(error.into());
            }
            
            let unwrap_fn = unwrap_prop.dyn_ref::<Function>().unwrap();
            let value = unwrap_fn.call0(&result)?;
            Ok(Option::new(true, value))
        } else {
            Ok(Option::new(false, JsValue::undefined()))
        }
    }

    #[wasm_bindgen(js_name = "or")]
    pub fn or(&self, optb: &Option) -> Option {
        if self.some {
            self.clone()
        } else {
            optb.clone()
        }
    }

    #[wasm_bindgen(js_name = "match")]
    pub fn match_option(&self, on_some: &Function, on_none: &Function) -> Result<JsValue, JsValue> {
        if self.some {
            on_some.call1(&JsValue::NULL, &self.value)
        } else {
            on_none.call0(&JsValue::NULL)
        }
    }

    #[wasm_bindgen(js_name = "filter")]
    pub fn filter(&self, predicate: &Function) -> Result<Option, JsValue> {
        if self.some {
            let result = predicate.call1(&JsValue::NULL, &self.value)?;
            if result.is_truthy() {
                Ok(self.clone())
            } else {
                Ok(Option::new(false, JsValue::undefined()))
            }
        } else {
            Ok(Option::new(false, JsValue::undefined()))
        }
    }

    #[wasm_bindgen(js_name = "exists")]
    pub fn exists(&self, predicate: &Function) -> Result<bool, JsValue> {
        if self.some {
            let result = predicate.call1(&JsValue::NULL, &self.value)?;
            Ok(result.is_truthy())
        } else {
            Ok(false)
        }
    }
    
    #[wasm_bindgen(js_name = "toString")]
    pub fn to_string_js(&self) -> String {
        if self.some {
            match js_sys::JSON::stringify(&self.value) {
                Ok(json_str) => format!("[Some {}]", json_str),
                Err(_) => "[Some <unprintable>]".to_string(),
            }
        } else {
            "[None]".to_string()
        }
    }

    #[wasm_bindgen(js_name = "clone")]
    pub fn clone(&self) -> Option {
        Option {
            some: self.some,
            value: self.value.clone(),
        }
    }
}

#[wasm_bindgen(js_name = "createSome")]
pub fn create_some(value: JsValue) -> Result<Option, JsValue> {
    if value.is_null() || value.is_undefined() {
        let error = Object::new();
        Reflect::set(&error, &"message".into(), &"Cannot create Some with null or undefined value".into())?;
        Reflect::set(&error, &"name".into(), &"ValidationError".into())?;
        return Err(error.into());
    }
    Ok(Option::new(true, value))
}

#[wasm_bindgen(js_name = "createNone")]
pub fn create_none() -> Option {
    Option::new(false, JsValue::undefined())
}

#[wasm_bindgen(js_name = "Some")]
pub fn some(value: JsValue) -> Result<Option, JsValue> {
    create_some(value)
}

#[wasm_bindgen(js_name = "None")]
pub fn none() -> Option {
    create_none()
}

#[wasm_bindgen(js_name = "from")]
pub fn from(value: JsValue) -> Option {
    if value.is_null() || value.is_undefined() {
        Option::new(false, JsValue::undefined())
    } else {
        Option::new(true, value)
    }
}

#[wasm_bindgen(js_name = "firstSome")]
pub fn first_some(options: &js_sys::Array) -> Result<Option, JsValue> {
    for i in 0..options.length() {
        let option = options.get(i);
        
        if !option.is_object() {
            continue;
        }
        
        if !Reflect::has(&option, &"isSome".into())? {
            continue;
        }
        
        let is_some_prop = Reflect::get(&option, &"isSome".into())?;
        if !is_some_prop.is_function() {
            continue;
        }
        
        let is_some_fn = is_some_prop.dyn_ref::<Function>().unwrap();
        let is_some_result = is_some_fn.call0(&option)?;
        
        if is_some_result.is_truthy() {
            if !Reflect::has(&option, &"unwrap".into())? {
                continue;
            }
            
            let unwrap_prop = Reflect::get(&option, &"unwrap".into())?;
            if !unwrap_prop.is_function() {
                continue;
            }
            
            let unwrap_fn = unwrap_prop.dyn_ref::<Function>().unwrap();
            let value = unwrap_fn.call0(&option)?;
            return Ok(Option::new(true, value));
        }
    }
    
    Ok(Option::new(false, JsValue::undefined()))
}

#[wasm_bindgen(js_name = "all")]
pub fn all(options: &js_sys::Array) -> Result<Option, JsValue> {
    let values = js_sys::Array::new();
    
    for i in 0..options.length() {
        let option = options.get(i);
        
        if !option.is_object() {
            let error = Object::new();
            Reflect::set(&error, &"message".into(), &"Array contains non-Option values".into())?;
            Reflect::set(&error, &"name".into(), &"TypeError".into())?;
            return Err(error.into());
        }
        
        if !Reflect::has(&option, &"isSome".into())? || !Reflect::has(&option, &"isNone".into())? {
            let error = Object::new();
            Reflect::set(&error, &"message".into(), &"Array contains non-Option values".into())?;
            Reflect::set(&error, &"name".into(), &"TypeError".into())?;
            return Err(error.into());
        }
        
        let is_some_prop = Reflect::get(&option, &"isSome".into())?;
        if !is_some_prop.is_function() {
            let error = Object::new();
            Reflect::set(&error, &"message".into(), &"Array contains non-Option values".into())?;
            Reflect::set(&error, &"name".into(), &"TypeError".into())?;
            return Err(error.into());
        }
        
        let is_some_fn = is_some_prop.dyn_ref::<Function>().unwrap();
        let is_some_result = is_some_fn.call0(&option)?;
        
        if !is_some_result.is_truthy() {
            return Ok(Option::new(false, JsValue::undefined()));
        }
        
        let unwrap_prop = Reflect::get(&option, &"unwrap".into())?;
        if !unwrap_prop.is_function() {
            let error = Object::new();
            Reflect::set(&error, &"message".into(), &"Option object missing unwrap method".into())?;
            Reflect::set(&error, &"name".into(), &"TypeError".into())?;
            return Err(error.into());
        }
        
        let unwrap_fn = unwrap_prop.dyn_ref::<Function>().unwrap();
        let value = unwrap_fn.call0(&option)?;
        values.push(&value);
    }
    
    Ok(Option::new(true, values.into()))
}