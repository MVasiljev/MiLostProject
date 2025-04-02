use wasm_bindgen::prelude::*;
use js_sys::{Reflect, Error as JsError, Object, Function};
use crate::str::Str;

#[wasm_bindgen]
pub struct ValidationError {
    message: Str,
}

#[wasm_bindgen]
impl ValidationError {
    #[wasm_bindgen(constructor)]
    pub fn new(message: &Str) -> Self {
        Self {
            message: message.clone(),
        }
    }

    #[wasm_bindgen]
    pub fn message(&self) -> Str {
        self.message.clone()
    }
    
    #[wasm_bindgen(js_name = "toJS")]
    pub fn to_js(&self) -> JsValue {
        let error = JsError::new(&self.message.to_string());
        let _ = Reflect::set(&error, &JsValue::from_str("name"), &JsValue::from_str("ValidationError"));
        error.into()
    }
}

#[wasm_bindgen]
pub struct ErrorFactory {
    name: String,
    default_message: String,
}

#[wasm_bindgen]
impl ErrorFactory {
    #[wasm_bindgen(constructor)]
    pub fn new(name: String, default_message: String) -> ErrorFactory {
        ErrorFactory { 
            name,
            default_message,
        }
    }

    #[wasm_bindgen(js_name = "createAppError")]
    pub fn create_app_error(&self, message: &str) -> JsValue {
        let error = JsError::new(message);
        let _ = Reflect::set(&error, &JsValue::from_str("name"), &JsValue::from_str(&self.name));
        error.into()
    }

    #[wasm_bindgen(js_name = "getName")]
    pub fn get_name(&self) -> String {
        self.name.clone()
    }
    
    #[wasm_bindgen(js_name = "getDefaultMessage")]
    pub fn get_default_message(&self) -> String {
        self.default_message.clone()
    }
}

#[wasm_bindgen(js_name = "createAppError")]
pub fn create_app_error(message: &str) -> JsValue {
    let error = JsError::new(message);
    let _ = Reflect::set(&error, &JsValue::from_str("name"), &JsValue::from_str("AppError"));
    error.into()
}

#[wasm_bindgen(js_name = "createValidationError")]
pub fn create_validation_error(message: &str) -> JsValue {
    let error = JsError::new(message);
    let _ = Reflect::set(&error, &JsValue::from_str("name"), &JsValue::from_str("ValidationError"));
    error.into()
}

#[wasm_bindgen(js_name = "createNetworkError")]
pub fn create_network_error(message: &str) -> JsValue {
    let error = JsError::new(message);
    let _ = Reflect::set(&error, &JsValue::from_str("name"), &JsValue::from_str("NetworkError"));
    error.into()
}

#[wasm_bindgen(js_name = "createAuthenticationError")]
pub fn create_authentication_error(message: &str) -> JsValue {
    let error = JsError::new(message);
    let _ = Reflect::set(&error, &JsValue::from_str("name"), &JsValue::from_str("AuthenticationError"));
    error.into()
}

#[wasm_bindgen(js_name = "createNotFoundError")]
pub fn create_not_found_error(message: &str, resource_type: Option<String>) -> JsValue {
    let error = JsError::new(message);
    let _ = Reflect::set(&error, &JsValue::from_str("name"), &JsValue::from_str("NotFoundError"));
    
    if let Some(res_type) = resource_type {
        let _ = Reflect::set(&error, &JsValue::from_str("resourceType"), &JsValue::from_str(&res_type));
    }
    
    error.into()
}

#[wasm_bindgen(js_name = "createUnauthorizedError")]
pub fn create_unauthorized_error(message: &str) -> JsValue {
    let error = JsError::new(message);
    let _ = Reflect::set(&error, &JsValue::from_str("name"), &JsValue::from_str("UnauthorizedError"));
    error.into()
}

#[wasm_bindgen(js_name = "createForbiddenError")]
pub fn create_forbidden_error(message: &str) -> JsValue {
    let error = JsError::new(message);
    let _ = Reflect::set(&error, &JsValue::from_str("name"), &JsValue::from_str("ForbiddenError"));
    error.into()
}

#[wasm_bindgen(js_name = "createDatabaseError")]
pub fn create_database_error(message: &str) -> JsValue {
    let error = JsError::new(message);
    let _ = Reflect::set(&error, &JsValue::from_str("name"), &JsValue::from_str("DatabaseError"));
    error.into()
}

#[wasm_bindgen(js_name = "createServerError")]
pub fn create_server_error(message: &str) -> JsValue {
    let error = JsError::new(message);
    let _ = Reflect::set(&error, &JsValue::from_str("name"), &JsValue::from_str("ServerError"));
    error.into()
}

#[wasm_bindgen(js_name = "createBusinessLogicError")]
pub fn create_business_logic_error(message: &str) -> JsValue {
    let error = JsError::new(message);
    let _ = Reflect::set(&error, &JsValue::from_str("name"), &JsValue::from_str("BusinessLogicError"));
    error.into()
}

#[wasm_bindgen(js_name = "createResourceConflictError")]
pub fn create_resource_conflict_error(message: &str) -> JsValue {
    let error = JsError::new(message);
    let _ = Reflect::set(&error, &JsValue::from_str("name"), &JsValue::from_str("ResourceConflictError"));
    error.into()
}

#[wasm_bindgen(js_name = "createConfigurationError")]
pub fn create_configuration_error(message: &str) -> JsValue {
    let error = JsError::new(message);
    let _ = Reflect::set(&error, &JsValue::from_str("name"), &JsValue::from_str("ConfigurationError"));
    error.into()
}

#[wasm_bindgen(js_name = "createRateLimitError")]
pub fn create_rate_limit_error(message: &str, retry_after_seconds: Option<u32>) -> JsValue {
    let error = JsError::new(message);
    let _ = Reflect::set(&error, &JsValue::from_str("name"), &JsValue::from_str("RateLimitError"));
    
    if let Some(seconds) = retry_after_seconds {
        let _ = Reflect::set(&error, &JsValue::from_str("retryAfterSeconds"), &JsValue::from_f64(seconds as f64));
    }
    
    error.into()
}

#[wasm_bindgen(js_name = "createErrorFactory")]
pub fn create_error_factory(error_class_name: &str, default_message: &str) -> ErrorFactory {
    ErrorFactory::new(error_class_name.to_string(), default_message.to_string())
}

#[wasm_bindgen(js_name = "createDomainErrorsNamespace")]
pub fn create_domain_errors_namespace() -> Object {
    let obj = Object::new();
    
    let create_domain_error_class = |name: &str| -> Function {
        Function::new_with_args(
            "message", 
            &format!(
                "if (typeof this === 'undefined') {{ return new {}(message); }} 
                this.name = '{}'; 
                this.message = message;
                if (Error.captureStackTrace) {{
                    Error.captureStackTrace(this, {});
                }}", 
                name, name, name
            )
        )
    };
    
    let _ = Reflect::set(
        &obj, 
        &JsValue::from_str("BusinessLogicError"), 
        &create_domain_error_class("BusinessLogicError")
    );
    
    let _ = Reflect::set(
        &obj, 
        &JsValue::from_str("ResourceConflictError"), 
        &create_domain_error_class("ResourceConflictError")
    );
    
    let _ = Reflect::set(
        &obj, 
        &JsValue::from_str("ConfigurationError"), 
        &create_domain_error_class("ConfigurationError")
    );
    
    let _ = Reflect::set(
        &obj, 
        &JsValue::from_str("RateLimitError"), 
        &create_domain_error_class("RateLimitError")
    );
    
    obj
}