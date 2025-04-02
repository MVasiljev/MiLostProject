use wasm_bindgen::prelude::*;
use wasm_bindgen::JsValue;
use milost_ui::{SpacerProps, UIComponent};

#[wasm_bindgen]
pub struct SpacerBuilder {
    size: Option<f32>,
}

#[wasm_bindgen]
impl SpacerBuilder {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Self { size: None }
    }

    #[wasm_bindgen(method)]
    pub fn size(mut self, value: f32) -> Self {
        self.size = Some(value);
        self
    }

    #[wasm_bindgen(method)]
    pub fn build(&self) -> Result<JsValue, JsValue> {
        let component = UIComponent::Spacer(SpacerProps {
            size: self.size,
        });

        serde_json::to_string(&component)
            .map(|s| JsValue::from_str(&s))
            .map_err(|e| JsValue::from_str(&format!("Serialization error: {}", e)))
    }
}
