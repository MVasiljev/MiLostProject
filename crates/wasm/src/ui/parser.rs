use wasm_bindgen::prelude::*;
use wasm_bindgen::JsValue;
use milost_ui::{TextProps, UIComponent, FontStyle, Color};

use crate::text::TextBuilder;

#[wasm_bindgen]
pub struct UIParser;

#[wasm_bindgen]
impl UIParser {
    #[wasm_bindgen]
    pub fn parse(input: &str) -> Result<JsValue, JsValue> {
        match serde_json::from_str::<UIComponent>(input) {
            Ok(component) => serde_json::to_string(&component)
                .map(|s| JsValue::from_str(&s))
                .map_err(|e| JsValue::from_str(&format!("Serialization error: {}", e))),
            Err(e) => Err(JsValue::from_str(&format!("Parsing error: {}", e))),
        }
    }

    #[wasm_bindgen]
    pub fn create_text(content: &str, font_style: &str, color: &str) -> Result<JsValue, JsValue> {
        let builder = TextBuilder::new(content)
            .font_style(font_style)
            .color(color);

        builder.build()
    }
}
