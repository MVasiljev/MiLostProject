// use wasm_bindgen::prelude::*;
// use js_sys::{Object, Reflect, Array, Function};
// use crate::str::Str;
// use crate::result::ResultWrapper;
// use crate::error::ValidationError;

// #[wasm_bindgen]
// pub struct Branded {
//     value: JsValue,
//     brand: Str,
// }

// #[wasm_bindgen]
// impl Branded {
//     #[wasm_bindgen(constructor)]
//     pub fn new(value: JsValue, brand: Str) -> Self {
//         Self {
//             value,
//             brand,
//         }
//     }

//     #[wasm_bindgen(js_name = "create")]
//     pub fn create(value: JsValue, brand: Str, validator: &js_sys::Function, error_message: Option<Str>) -> ResultWrapper {
//         let is_valid = validator
//             .call1(&JsValue::null(), &value)
//             .unwrap_or(JsValue::FALSE)
//             .as_bool()
//             .unwrap_or(false);

//         if !is_valid {
//             let message = match error_message {
//                 Some(msg) => msg,
//                 None => {
//                     // Create a simple description of the value
//                     let value_description = if value.is_string() {
//                         format!("\"{}\"", value.as_string().unwrap_or_default())
//                     } else if value.is_object() {
//                         "[object]".to_string()
//                     } else if value.is_null() {
//                         "null".to_string()
//                     } else if value.is_undefined() {
//                         "undefined".to_string()
//                     } else {
//                         // Simple type detection without Object.prototype
//                         let bool_result = value.as_bool();
//                         if bool_result.is_ok() {
//                             format!("{}", bool_result.unwrap())
//                         } else {
//                             let num_result = value.as_f64();
//                             if num_result.is_ok() {
//                                 format!("{}", num_result.unwrap())
//                             } else {
//                                 "[unknown]".to_string()
//                             }
//                         }
//                     };
                    
//                     let brand_str = brand.to_string();
//                     let formatted = format!("Invalid {} value: {}", brand_str, value_description);
//                     Str::new(&formatted)
//                 }
//             };
            
//             // Create ValidationError and wrap it in Result::err
//             let validation_error = ValidationError::new(&message);
//             return ResultWrapper::err(&validation_error.to_js());
//         }

//         // Create a new Branded instance and wrap it in Result::ok
//         let branded = Branded::new(value, brand);
//         ResultWrapper::ok(&JsValue::from(branded))
//     }

//     #[wasm_bindgen(js_name = "is")]
//     pub fn is(value: &JsValue, brand: Str) -> bool {
//         if !value.is_object() {
//             return false;
//         }

//         let obj = Object::from(value.clone());
        
//         // Check if it's an instance of Branded
//         if let Ok(prototype) = Reflect::get_prototype_of(&obj) {
//             if let Ok(constructor) = Reflect::get(&prototype, &JsValue::from_str("constructor")) {
//                 if let Ok(name) = Reflect::get(&constructor, &JsValue::from_str("name")) {
//                     if name.as_string().unwrap_or_default() != "Branded" {
//                         return false;
//                     }
//                 }
//             }
//         }

//         // Check if brand matches
//         if let Ok(obj_brand) = Reflect::get(&obj, &JsValue::from_str("_brand")) {
//             let empty_array = Array::new();
//             if let Ok(unwrap_method) = Reflect::get(&obj_brand, &JsValue::from_str("unwrap")) {
//                 // Cast to Function before using apply
//                 if let Some(unwrap_fn) = unwrap_method.dyn_ref::<Function>() {
//                     if let Ok(brand_unwrapped) = unwrap_fn.apply(&obj_brand, &empty_array) {
//                         return brand_unwrapped.as_string().unwrap_or_default() == brand.to_string();
//                     }
//                 }
//             }
//         }

//         false
//     }

//     #[wasm_bindgen(js_name = "unwrap")]
//     pub fn unwrap(&self) -> JsValue {
//         self.value.clone()
//     }

//     #[wasm_bindgen(js_name = "brand")]
//     pub fn brand(&self) -> Str {
//         self.brand.clone()
//     }

//     #[wasm_bindgen(js_name = "toJSON")]
//     pub fn to_json(&self) -> JsValue {
//         self.value.clone()
//     }

//     #[wasm_bindgen(js_name = "toString")]
//     pub fn to_string(&self) -> String {
//         format!("[Branded {}]", self.brand.to_string())
//     }
// }

// #[wasm_bindgen(js_name = "createBranded")]
// pub fn create_branded(value: JsValue, brand: Str, validator: &js_sys::Function, error_message: Option<Str>) -> ResultWrapper {
//     Branded::create(value, brand, validator, error_message)
// }

// #[wasm_bindgen(js_name = "isBranded")]
// pub fn is_branded(value: &JsValue, brand: Str) -> bool {
//     Branded::is(value, brand)
// }