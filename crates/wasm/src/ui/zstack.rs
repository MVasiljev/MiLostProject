use wasm_bindgen::prelude::*;
use wasm_bindgen::JsValue;
use milost_ui::{UIComponent, ZStackProps};

#[wasm_bindgen]
pub struct ZStackBuilder {
    alignment: Option<String>,
    children: Vec<UIComponent>,
}

#[wasm_bindgen]
impl ZStackBuilder {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Self {
            alignment: None,
            children: Vec::new(),
        }
    }

    #[wasm_bindgen(method)]
    pub fn alignment(mut self, alignment: &str) -> Self {
        self.alignment = Some(alignment.to_string());
        self
    }

    #[wasm_bindgen(method)]
    pub fn child(mut self, component_js: &JsValue) -> Self {
        if let Some(component_str) = component_js.as_string() {
            if let Ok(component) = serde_json::from_str::<UIComponent>(&component_str) {
                self.children.push(component);
            }
        }
        self
    }

    #[wasm_bindgen(method)]
    pub fn build(&self) -> Result<JsValue, JsValue> {
        let component = UIComponent::ZStack(ZStackProps {
            alignment: self.alignment.clone(),
            children: self.children.clone(),
        });

        serde_json::to_string(&component)
            .map(|s| JsValue::from_str(&s))
            .map_err(|e| JsValue::from_str(&format!("Serialization error: {}", e)))
    }
}
