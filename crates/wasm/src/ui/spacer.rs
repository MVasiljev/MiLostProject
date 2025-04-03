use wasm_bindgen::prelude::*;
use wasm_bindgen::JsValue;
use milost_ui::{SpacerProps, UIComponent};

#[wasm_bindgen]
pub struct SpacerBuilder {
    size: Option<f32>,
    min_size: Option<f32>,
    max_size: Option<f32>,
    flex_grow: Option<f32>,
}

#[wasm_bindgen]
impl SpacerBuilder {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Self { 
            size: None, 
            min_size: None, 
            max_size: None, 
            flex_grow: None 
        }
    }

    #[wasm_bindgen(method)]
    pub fn size(mut self, value: f32) -> Self {
        self.size = Some(value);
        self
    }

    #[wasm_bindgen(method)]
    pub fn min_size(mut self, value: f32) -> Self {
        self.min_size = Some(value);
        self
    }

    #[wasm_bindgen(method)]
    pub fn max_size(mut self, value: f32) -> Self {
        self.max_size = Some(value);
        self
    }

    #[wasm_bindgen(method)]
    pub fn flex_grow(mut self, value: f32) -> Self {
        self.flex_grow = Some(value);
        self
    }

    #[wasm_bindgen(method)]
    pub fn build(&self) -> Result<JsValue, JsValue> {
        let component = UIComponent::Spacer(SpacerProps {
            size: self.size,
            min_size: self.min_size,
            max_size: self.max_size,
            flex_grow: self.flex_grow,
        });

        serde_json::to_string(&component)
            .map(|s| JsValue::from_str(&s))
            .map_err(|e| JsValue::from_str(&format!("Serialization error: {}", e)))
    }
}