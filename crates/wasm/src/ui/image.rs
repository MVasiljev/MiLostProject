use wasm_bindgen::prelude::*;
use wasm_bindgen::JsValue;
use milost_ui::{ImageProps, UIComponent};

#[wasm_bindgen]
pub struct ImageBuilder {
    src: String,
    alt: Option<String>,
}

#[wasm_bindgen]
impl ImageBuilder {
    #[wasm_bindgen(constructor)]
    pub fn new(src: &str) -> Self {
        Self {
            src: src.to_string(),
            alt: None,
        }
    }

    #[wasm_bindgen(method)]
    pub fn alt(mut self, alt_text: &str) -> Self {
        self.alt = Some(alt_text.to_string());
        self
    }

    #[wasm_bindgen(method)]
    pub fn build(&self) -> Result<JsValue, JsValue> {
        let component = UIComponent::Image(ImageProps {
            src: self.src.clone(),
            alt: self.alt.clone(),
        });

        serde_json::to_string(&component)
            .map(|s| JsValue::from_str(&s))
            .map_err(|e| JsValue::from_str(&format!("Serialization error: {}", e)))
    }
}
