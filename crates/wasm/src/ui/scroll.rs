use wasm_bindgen::prelude::*;
use wasm_bindgen::JsValue;
use milost_ui::{UIComponent, ScrollProps, ScrollDirection};

#[wasm_bindgen]
pub struct ScrollBuilder {
    direction: ScrollDirection,
    children: Vec<UIComponent>,
}

#[wasm_bindgen]
impl ScrollBuilder {
    #[wasm_bindgen(constructor)]
    pub fn new(direction: &str) -> Self {
        let parsed_direction = match direction {
            "horizontal" => ScrollDirection::Horizontal,
            _ => ScrollDirection::Vertical,
        };

        Self {
            direction: parsed_direction,
            children: Vec::new(),
        }
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
        let component = UIComponent::Scroll(ScrollProps {
            direction: self.direction.clone(),
            children: self.children.clone(),
        });

        serde_json::to_string(&component)
            .map(|s| JsValue::from_str(&s))
            .map_err(|e| JsValue::from_str(&format!("Serialization error: {}", e)))
    }
}
