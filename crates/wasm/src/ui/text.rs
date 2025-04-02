use wasm_bindgen::prelude::*;
use wasm_bindgen::JsValue;
use milost_ui::{Color, FontStyle, TextProps, UIComponent};

#[wasm_bindgen]
pub struct TextBuilder {
    content: String,
    font_style: Option<FontStyle>,
    color: Option<Color>,
}

#[wasm_bindgen]
impl TextBuilder {
    #[wasm_bindgen(constructor)]
    pub fn new(content: &str) -> Self {
        Self {
            content: content.to_string(),
            font_style: None,
            color: None,
        }
    }

    #[wasm_bindgen(method)]
    pub fn font_style(mut self, style_str: &str) -> Self {
        self.font_style = match style_str {
            "Title" => Some(FontStyle::Title),
            "Body" => Some(FontStyle::Body),
            "Caption" => Some(FontStyle::Caption),
            _ => None,
        };
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
        let component = UIComponent::Text(TextProps {
            content: self.content.clone(),
            font_style: self.font_style.clone(),
            color: self.color.clone(),
        });

        serde_json::to_string(&component)
            .map(|s| JsValue::from_str(&s))
            .map_err(|e| JsValue::from_str(&format!("Serialization error: {}", e)))
    }
}
