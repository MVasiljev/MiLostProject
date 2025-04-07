use wasm_bindgen::prelude::*;
use serde::{Serialize, Deserialize};
use super::color::Color;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum TextAlignment {
    Left,
    Center,
    Right,
    Justify,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum FontWeight {
    Thin,
    ExtraLight,
    Light,
    Regular,
    Medium,
    SemiBold,
    Bold,
    ExtraBold,
    Black,
    Custom(u16),
}

impl FontWeight {
    pub fn to_css_string(&self) -> String {
        match self {
            FontWeight::Thin => "100".to_string(),
            FontWeight::ExtraLight => "200".to_string(),
            FontWeight::Light => "300".to_string(),
            FontWeight::Regular => "normal".to_string(),
            FontWeight::Medium => "500".to_string(),
            FontWeight::SemiBold => "600".to_string(),
            FontWeight::Bold => "bold".to_string(),
            FontWeight::ExtraBold => "800".to_string(),
            FontWeight::Black => "900".to_string(),
            FontWeight::Custom(weight) => weight.to_string(),
        }
    }
    
    pub fn from_str(weight: &str) -> Self {
        match weight.to_lowercase().as_str() {
            "thin" => FontWeight::Thin,
            "extralight" => FontWeight::ExtraLight,
            "light" => FontWeight::Light,
            "regular" | "normal" => FontWeight::Regular,
            "medium" => FontWeight::Medium,
            "semibold" => FontWeight::SemiBold,
            "bold" => FontWeight::Bold,
            "extrabold" => FontWeight::ExtraBold,
            "black" => FontWeight::Black,
            _ => {
                if let Ok(weight_val) = weight.parse::<u16>() {
                    FontWeight::Custom(weight_val)
                } else {
                    FontWeight::Regular
                }
            }
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TextComponentData {
    pub content: String,
    pub color: Option<String>,
    pub font_size: Option<f32>,
    pub font_weight: Option<String>,
    pub font_family: Option<String>,
    pub text_align: Option<TextAlignment>,
    pub line_height: Option<f32>,
    pub letter_spacing: Option<f32>,
    pub background_color: Option<String>,
    pub padding: Option<f32>,
    pub width: Option<f32>,
    pub height: Option<f32>,
}

#[wasm_bindgen]
pub struct TextBuilder {
    data: TextComponentData,
}

#[wasm_bindgen]
impl TextBuilder {
    #[wasm_bindgen(constructor)]
    pub fn new(content: &str) -> Self {
        Self {
            data: TextComponentData {
                content: content.to_string(),
                color: None,
                font_size: None,
                font_weight: None,
                font_family: None,
                text_align: None,
                line_height: None,
                letter_spacing: None,
                background_color: None,
                padding: None,
                width: None,
                height: None,
            }
        }
    }
    
    #[wasm_bindgen(method)]
    pub fn color(mut self, color: &str) -> Self {
        self.data.color = Some(Color::from_str(color).to_css_string());
        self
    }
    
    #[wasm_bindgen(method)]
    pub fn font_size(mut self, size: f32) -> Self {
        self.data.font_size = Some(size);
        self
    }
    
    #[wasm_bindgen(method)]
    pub fn font_weight(mut self, weight: &str) -> Self {
        self.data.font_weight = Some(FontWeight::from_str(weight).to_css_string());
        self
    }
    
    #[wasm_bindgen(method)]
    pub fn font_family(mut self, family: &str) -> Self {
        self.data.font_family = Some(family.to_string());
        self
    }
    
    #[wasm_bindgen(method)]
    pub fn text_align(mut self, align: &str) -> Self {
        self.data.text_align = match align.to_lowercase().as_str() {
            "left" => Some(TextAlignment::Left),
            "center" => Some(TextAlignment::Center),
            "right" => Some(TextAlignment::Right),
            "justify" => Some(TextAlignment::Justify),
            _ => None,
        };
        self
    }
    
    #[wasm_bindgen(method)]
    pub fn background_color(mut self, color: &str) -> Self {
        self.data.background_color = Some(Color::from_str(color).to_css_string());
        self
    }
    
    #[wasm_bindgen(method)]
    pub fn build(&self) -> Result<String, JsValue> {
        let component = serde_json::json!({
            "Text": self.data
        });
        
        serde_json::to_string(&component)
            .map_err(|e| JsValue::from_str(&format!("Serialization error: {}", e)))
    }
}