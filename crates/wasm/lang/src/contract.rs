use wasm_bindgen::prelude::*;
use js_sys::{Function, Object, Reflect};

#[wasm_bindgen]
pub struct ContractError {
    message: String,
}

#[wasm_bindgen]
impl ContractError {
    #[wasm_bindgen(constructor)]
    pub fn new(message: String) -> ContractError {
        ContractError { message }
    }

    #[wasm_bindgen(getter)]
    pub fn message(&self) -> String {
        self.message.clone()
    }

    #[wasm_bindgen(js_name = "toString")]
    pub fn to_string(&self) -> String {
        format!("ContractError: {}", self.message)
    }
}

#[wasm_bindgen(js_name = "requires")]
pub fn requires(condition: bool, error_message: Option<String>) -> Result<(), JsValue> {
    if !condition {
        let message = error_message.unwrap_or_else(|| "Precondition failed".to_string());
        let error = Object::new();
        Reflect::set(&error, &"name".into(), &"ContractError".into())?;
        Reflect::set(&error, &"message".into(), &message.into())?;
        return Err(error.into());
    }
    Ok(())
}

#[wasm_bindgen(js_name = "ensures")]
pub fn ensures(condition: bool, error_message: Option<String>) -> Result<(), JsValue> {
    if !condition {
        let message = error_message.unwrap_or_else(|| "Postcondition failed".to_string());
        let error = Object::new();
        Reflect::set(&error, &"name".into(), &"ContractError".into())?;
        Reflect::set(&error, &"message".into(), &message.into())?;
        return Err(error.into());
    }
    Ok(())
}

#[wasm_bindgen(js_name = "contract")]
pub fn contract(
    function: &Function,
    precondition: Option<Function>,
    postcondition: Option<Function>,
    pre_error_msg: Option<String>,
    post_error_msg: Option<String>,
) -> Result<Function, JsValue> {
    let wrapper_code = r#"
    (function(fn, precondition, postcondition, pre_error_msg, post_error_msg) {
        pre_error_msg = pre_error_msg || "Precondition failed";
        post_error_msg = post_error_msg || "Postcondition failed";
        
        return function(arg) {
            // Check precondition
            if (precondition && !precondition(arg)) {
                const error = new Error(pre_error_msg);
                error.name = "ContractError";
                throw error;
            }
            
            // Call the original function
            const result = fn(arg);
            
            // Check postcondition
            if (postcondition && !postcondition(arg, result)) {
                const error = new Error(post_error_msg);
                error.name = "ContractError";
                throw error;
            }
            
            return result;
        };
    })
    "#;
    
    let eval_fn = js_sys::eval(wrapper_code)?;
    let wrapper_fn = eval_fn.dyn_into::<Function>()?;
    
    let pre_error = pre_error_msg.unwrap_or_else(|| "Precondition failed".to_string());
    let pre_error_js = JsValue::from_str(&pre_error);
    
    let post_error = post_error_msg.unwrap_or_else(|| "Postcondition failed".to_string());
    let post_error_js = JsValue::from_str(&post_error);
    
    let pre_param = match precondition {
        Some(pre) => pre.into(),
        None => JsValue::null(),
    };
    
    let post_param = match postcondition {
        Some(post) => post.into(),
        None => JsValue::null(),
    };
    
    let args = js_sys::Array::new();
    args.push(function);
    args.push(&pre_param);
    args.push(&post_param);
    args.push(&pre_error_js);
    args.push(&post_error_js);
    
    let result = wrapper_fn.apply(&JsValue::null(), &args)?;
    
    Ok(result.dyn_into::<Function>()?)
}