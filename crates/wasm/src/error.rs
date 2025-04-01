use wasm_bindgen::prelude::*;
use js_sys::{ Reflect, Error as JsError};

#[wasm_bindgen]
pub struct ErrorFactory {
    name: String,
}

#[wasm_bindgen]
impl ErrorFactory {
    #[wasm_bindgen(constructor)]
    pub fn new(name: String) -> ErrorFactory {
        ErrorFactory { name }
    }

    #[wasm_bindgen(js_name = "createAppError")]
    pub fn create_app_error(&self, message: &str) -> JsValue {
        let error = JsError::new(message);
        let _ = Reflect::set(&error, &"name".into(), &self.name.clone().into());
        error.into()
    }

    #[wasm_bindgen(js_name = "getName")]
    pub fn get_name(&self) -> String {
        self.name.clone()
    }
}

#[wasm_bindgen(js_name = "createAppError")]
pub fn create_app_error(message: &str) -> JsValue {
    let error = JsError::new(message);
    let _ = Reflect::set(&error, &"name".into(), &"AppError".into());
    error.into()
}

#[wasm_bindgen(js_name = "createValidationError")]
pub fn create_validation_error(message: &str) -> JsValue {
    let error = JsError::new(message);
    let _ = Reflect::set(&error, &"name".into(), &"ValidationError".into());
    error.into()
}

#[wasm_bindgen(js_name = "createNetworkError")]
pub fn create_network_error(message: &str) -> JsValue {
    let error = JsError::new(message);
    let _ = Reflect::set(&error, &"name".into(), &"NetworkError".into());
    error.into()
}

#[wasm_bindgen(js_name = "createAuthenticationError")]
pub fn create_authentication_error(message: &str) -> JsValue {
    let error = JsError::new(message);
    let _ = Reflect::set(&error, &"name".into(), &"AuthenticationError".into());
    error.into()
}

#[wasm_bindgen(js_name = "createNotFoundError")]
pub fn create_not_found_error(message: &str, resource_type: Option<String>) -> JsValue {
    let error = JsError::new(message);
    let _ = Reflect::set(&error, &"name".into(), &"NotFoundError".into());
    
    if let Some(res_type) = resource_type {
        let _ = Reflect::set(&error, &"resourceType".into(), &res_type.into());
    }
    
    error.into()
}

#[wasm_bindgen(js_name = "createUnauthorizedError")]
pub fn create_unauthorized_error(message: &str) -> JsValue {
    let error = JsError::new(message);
    let _ = Reflect::set(&error, &"name".into(), &"UnauthorizedError".into());
    error.into()
}

#[wasm_bindgen(js_name = "createForbiddenError")]
pub fn create_forbidden_error(message: &str) -> JsValue {
    let error = JsError::new(message);
    let _ = Reflect::set(&error, &"name".into(), &"ForbiddenError".into());
    error.into()
}

#[wasm_bindgen(js_name = "createDatabaseError")]
pub fn create_database_error(message: &str) -> JsValue {
    let error = JsError::new(message);
    let _ = Reflect::set(&error, &"name".into(), &"DatabaseError".into());
    error.into()
}

#[wasm_bindgen(js_name = "createServerError")]
pub fn create_server_error(message: &str) -> JsValue {
    let error = JsError::new(message);
    let _ = Reflect::set(&error, &"name".into(), &"ServerError".into());
    error.into()
}

#[wasm_bindgen(js_name = "createBusinessLogicError")]
pub fn create_business_logic_error(message: &str) -> JsValue {
    let error = JsError::new(message);
    let _ = Reflect::set(&error, &"name".into(), &"BusinessLogicError".into());
    error.into()
}

#[wasm_bindgen(js_name = "createResourceConflictError")]
pub fn create_resource_conflict_error(message: &str) -> JsValue {
    let error = JsError::new(message);
    let _ = Reflect::set(&error, &"name".into(), &"ResourceConflictError".into());
    error.into()
}

#[wasm_bindgen(js_name = "createConfigurationError")]
pub fn create_configuration_error(message: &str) -> JsValue {
    let error = JsError::new(message);
    let _ = Reflect::set(&error, &"name".into(), &"ConfigurationError".into());
    error.into()
}

#[wasm_bindgen(js_name = "createRateLimitError")]
pub fn create_rate_limit_error(message: &str, retry_after_seconds: Option<u32>) -> JsValue {
    let error = JsError::new(message);
    let _ = Reflect::set(&error, &"name".into(), &"RateLimitError".into());
    
    if let Some(seconds) = retry_after_seconds {
        let _ = Reflect::set(&error, &"retryAfterSeconds".into(), &seconds.into());
    }
    
    error.into()
}

#[wasm_bindgen(js_name = "createErrorFactory")]
pub fn create_error_factory(error_class_name: &str, _default_message: &str) -> ErrorFactory {
    ErrorFactory::new(error_class_name.to_string())
}