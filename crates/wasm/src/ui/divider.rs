use wasm_bindgen::prelude::*;
use wasm_bindgen::JsValue;
use milost_ui::{DividerProps, Color, UIComponent};

#[wasm_bindgen]
pub struct DividerBuilder {
    thickness: Option<f32>,
    color: Option<Color>,
}

#[wasm_bindgen]
impl DividerBuilder {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Self {
            thickness: None,
            color: None,
        }
    }

    #[wasm_bindgen(method)]
    pub fn thickness(mut self, value: f32) -> Self {
        self.thickness = Some(value);
        self
    }

    #[wasm_bindgen(method)]
    pub fn color(mut self, color_str: &str) -> Self {
        self.color = match color_str {
            "White" => Some(Color::White),
            "Blue" => Some(Color::Blue),
            "Black" => Some(Color::Black),
            _ => None,
        };
        self
    }

    #[wasm_bindgen(method)]
    pub fn build(&self) -> Result<JsValue, JsValue> {
        let component = UIComponent::Divider(DividerProps {
            thickness: self.thickness,
            color: self.color.clone(),
        });

        serde_json::to_string(&component)
            .map(|s| JsValue::from_str(&s))
            .map_err(|e| JsValue::from_str(&format!("Serialization error: {}", e)))
    }
}
