use wasm_bindgen::prelude::*;
use wasm_bindgen::JsValue;
use milost_ui::{Color, UIComponent};

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
    pub fn new() -> Self {
        Self { spacing: None, padding: None, background: None, children: Vec::new() }
    }

    #[wasm_bindgen(method)]
    pub fn spacing(mut self, spacing: f32) -> Self {
        self.spacing = Some(spacing); self
    }

    #[wasm_bindgen(method)]
    pub fn padding(mut self, padding: f32) -> Self {
        self.padding = Some(padding); self
    }

    #[wasm_bindgen(method)]
    pub fn background(mut self, color_str: &str) -> Self {
        self.background = match color_str {
            "White" => Some(Color::White),
            "Blue" => Some(Color::Blue),
            "Black" => Some(Color::Black),
            _ => None,
        };
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
        let component = UIComponent::VStack(milost_ui::VStackProps {
            spacing: self.spacing,
            padding: self.padding,
            background: self.background.clone(),
            children: self.children.clone(),
        });

        serde_json::to_string(&component)
            .map(|s| JsValue::from_str(&s))
            .map_err(|e| JsValue::from_str(&format!("Serialization error: {}", e)))
    }
}

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
    pub fn new() -> Self {
        Self {
            spacing: None,
            padding: None,
            background: None,
            children: Vec::new(),
        }
    }

    #[wasm_bindgen(method)]
    pub fn spacing(mut self, spacing: f32) -> Self {
        self.spacing = Some(spacing);
        self
    }

    #[wasm_bindgen(method)]
    pub fn padding(mut self, padding: f32) -> Self {
        self.padding = Some(padding);
        self
    }

    #[wasm_bindgen(method)]
    pub fn background(mut self, color_str: &str) -> Self {
        self.background = match color_str {
            "White" => Some(Color::White),
            "Blue" => Some(Color::Blue),
            "Black" => Some(Color::Black),
            _ => None,
        };
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
        let component = UIComponent::HStack(milost_ui::HStackProps {
            spacing: self.spacing,
            padding: self.padding,
            background: self.background.clone(),
            children: self.children.clone(),
        });

        serde_json::to_string(&component)
            .map(|s| JsValue::from_str(&s))
            .map_err(|e| JsValue::from_str(&format!("Serialization error: {}", e)))
    }
}