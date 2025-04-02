use wasm_bindgen::prelude::*;
use wasm_bindgen::JsValue;
use milost_ui::{ButtonProps, UIComponent};

#[wasm_bindgen]
pub struct ButtonBuilder {
    label: String,
    on_tap: Option<String>,
}

#[wasm_bindgen]
impl ButtonBuilder {
    #[wasm_bindgen(constructor)]
    pub fn new(label: &str) -> Self {
        Self {
            label: label.to_string(),
            on_tap: None,
        }
    }

    #[wasm_bindgen(method)]
    pub fn on_tap(mut self, handler: &str) -> Self {
        self.on_tap = Some(handler.to_string());
        self
    }

    #[wasm_bindgen(method)]
    pub fn build(&self) -> Result<JsValue, JsValue> {
        let component = UIComponent::Button(ButtonProps {
            label: self.label.clone(),
            on_tap: self.on_tap.clone(),
        });

        serde_json::to_string(&component)
            .map(|s| JsValue::from_str(&s))
            .map_err(|e| JsValue::from_str(&format!("Serialization error: {}", e)))
    }
}
