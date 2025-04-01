use wasm_bindgen::prelude::*;
use serde::{Deserialize, Serialize};
use wasm_bindgen::JsValue;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub enum Color {
    White,
    Blue,
    Black,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub enum FontStyle {
    Title,
    Body,
    Caption,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub enum UIComponent {
    VStack {
        spacing: Option<f32>,
        padding: Option<f32>,
        background: Option<Color>,
        children: Vec<UIComponent>
    },
    HStack {
        spacing: Option<f32>,
        padding: Option<f32>,
        background: Option<Color>,
        children: Vec<UIComponent>
    },
    Text {
        content: String,
        font_style: Option<FontStyle>,
        color: Option<Color>
    },
    Button {
        label: String,
        on_tap: Option<String>
    }
}

// VStack Builder
#[wasm_bindgen]
pub struct VStackBuilder {
    spacing: Option<f32>,
    padding: Option<f32>,
    background: Option<Color>,
    children: Vec<UIComponent>,
}

#[wasm_bindgen]
impl VStackBuilder {
    #[wasm_bindgen(constructor)]
    pub fn new() -> VStackBuilder {
        VStackBuilder {
            spacing: None,
            padding: None,
            background: None,
            children: Vec::new(),
        }
    }

    #[wasm_bindgen(method)]
    pub fn spacing(mut self, spacing: f32) -> VStackBuilder {
        self.spacing = Some(spacing);
        self
    }

    #[wasm_bindgen(method)]
    pub fn padding(mut self, padding: f32) -> VStackBuilder {
        self.padding = Some(padding);
        self
    }

    #[wasm_bindgen(method)]
    pub fn background(mut self, color_str: &str) -> VStackBuilder {
        self.background = match color_str {
            "White" => Some(Color::White),
            "Blue" => Some(Color::Blue),
            "Black" => Some(Color::Black),
            _ => None,
        };
        self
    }

    #[wasm_bindgen(method)]
    pub fn child(mut self, component_js: &JsValue) -> VStackBuilder {
        if let Some(component_str) = component_js.as_string() {
            if let Ok(component) = serde_json::from_str::<UIComponent>(&component_str) {
                self.children.push(component);
            }
        }
        self
    }

    #[wasm_bindgen(method)]
    pub fn build(&self) -> Result<JsValue, JsValue> {
        let component = UIComponent::VStack {
            spacing: self.spacing,
            padding: self.padding,
            background: self.background.clone(),
            children: self.children.clone(),
        };

        match serde_json::to_string(&component) {
            Ok(json_str) => Ok(JsValue::from_str(&json_str)),
            Err(e) => Err(JsValue::from_str(&format!("Serialization error: {}", e)))
        }
    }
}

// HStack Builder
#[wasm_bindgen]
pub struct HStackBuilder {
    spacing: Option<f32>,
    padding: Option<f32>,
    background: Option<Color>,
    children: Vec<UIComponent>,
}

#[wasm_bindgen]
impl HStackBuilder {
    #[wasm_bindgen(constructor)]
    pub fn new() -> HStackBuilder {
        HStackBuilder {
            spacing: None,
            padding: None,
            background: None,
            children: Vec::new(),
        }
    }

    #[wasm_bindgen(method)]
    pub fn spacing(mut self, spacing: f32) -> HStackBuilder {
        self.spacing = Some(spacing);
        self
    }

    #[wasm_bindgen(method)]
    pub fn padding(mut self, padding: f32) -> HStackBuilder {
        self.padding = Some(padding);
        self
    }

    #[wasm_bindgen(method)]
    pub fn background(mut self, color_str: &str) -> HStackBuilder {
        self.background = match color_str {
            "White" => Some(Color::White),
            "Blue" => Some(Color::Blue),
            "Black" => Some(Color::Black),
            _ => None,
        };
        self
    }

    #[wasm_bindgen(method)]
    pub fn child(mut self, component_js: &JsValue) -> HStackBuilder {
        if let Some(component_str) = component_js.as_string() {
            if let Ok(component) = serde_json::from_str::<UIComponent>(&component_str) {
                self.children.push(component);
            }
        }
        self
    }

    #[wasm_bindgen(method)]
    pub fn build(&self) -> Result<JsValue, JsValue> {
        let component = UIComponent::HStack {
            spacing: self.spacing,
            padding: self.padding,
            background: self.background.clone(),
            children: self.children.clone(),
        };

        match serde_json::to_string(&component) {
            Ok(json_str) => Ok(JsValue::from_str(&json_str)),
            Err(e) => Err(JsValue::from_str(&format!("Serialization error: {}", e)))
        }
    }
}

// Text Builder
#[wasm_bindgen]
pub struct TextBuilder {
    content: String,
    font_style: Option<FontStyle>,
    color: Option<Color>,
}

#[wasm_bindgen]
impl TextBuilder {
    #[wasm_bindgen(constructor)]
    pub fn new(content: &str) -> TextBuilder {
        TextBuilder {
            content: content.to_string(),
            font_style: None,
            color: None,
        }
    }

    #[wasm_bindgen(method)]
    pub fn font_style(mut self, style_str: &str) -> TextBuilder {
        self.font_style = match style_str {
            "Title" => Some(FontStyle::Title),
            "Body" => Some(FontStyle::Body),
            "Caption" => Some(FontStyle::Caption),
            _ => None,
        };
        self
    }

    #[wasm_bindgen(method)]
    pub fn color(mut self, color_str: &str) -> TextBuilder {
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
        let component = UIComponent::Text {
            content: self.content.clone(),
            font_style: self.font_style.clone(),
            color: self.color.clone(),
        };

        match serde_json::to_string(&component) {
            Ok(json_str) => Ok(JsValue::from_str(&json_str)),
            Err(e) => Err(JsValue::from_str(&format!("Serialization error: {}", e)))
        }
    }
}

// Button Builder
#[wasm_bindgen]
pub struct ButtonBuilder {
    label: String,
    on_tap: Option<String>,
}

#[wasm_bindgen]
impl ButtonBuilder {
    #[wasm_bindgen(constructor)]
    pub fn new(label: &str) -> ButtonBuilder {
        ButtonBuilder {
            label: label.to_string(),
            on_tap: None,
        }
    }

    #[wasm_bindgen(method)]
    pub fn on_tap(mut self, handler: &str) -> ButtonBuilder {
        self.on_tap = Some(handler.to_string());
        self
    }

    #[wasm_bindgen(method)]
    pub fn build(&self) -> Result<JsValue, JsValue> {
        let component = UIComponent::Button {
            label: self.label.clone(),
            on_tap: self.on_tap.clone(),
        };

        match serde_json::to_string(&component) {
            Ok(json_str) => Ok(JsValue::from_str(&json_str)),
            Err(e) => Err(JsValue::from_str(&format!("Serialization error: {}", e)))
        }
    }
}

// Original UIParser for backward compatibility
#[wasm_bindgen]
pub struct UIParser;

#[wasm_bindgen]
impl UIParser {
    #[wasm_bindgen]
    pub fn parse(input: &str) -> Result<JsValue, JsValue> {
        match serde_json::from_str::<UIComponent>(input) {
            Ok(component) => match serde_json::to_string(&component) {
                Ok(json_str) => Ok(JsValue::from_str(&json_str)),
                Err(e) => Err(JsValue::from_str(&format!("Serialization error: {}", e)))
            },
            Err(e) => Err(JsValue::from_str(&format!("Parsing error: {}", e)))
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