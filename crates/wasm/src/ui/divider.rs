use wasm_bindgen::prelude::*;
use serde_json;
use milost_ui::{
    components::divider::{DividerProps, DividerStyle, LabelPosition},
    shared::color::Color,
    UIComponent
};

#[wasm_bindgen]
pub struct DividerBuilder {
    props: DividerProps,
}

#[wasm_bindgen]
impl DividerBuilder {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Self {
            props: DividerProps::default(),
        }
    }

    #[wasm_bindgen(method)]
    pub fn thickness(mut self, value: f32) -> Self {
        self.props.thickness = Some(value);
        self
    }

    #[wasm_bindgen(method)]
    pub fn color(mut self, color_str: &str) -> Self {
        self.props.color = match color_str.to_lowercase().as_str() {
            "white" => Some(Color::White),
            "black" => Some(Color::Black),
            "gray" => Some(Color::Gray),
            "lightgray" => Some(Color::LightGray),
            "darkgray" => Some(Color::DarkGray),
            "red" => Some(Color::Red),
            "green" => Some(Color::Green),
            "blue" => Some(Color::Blue),
            "yellow" => Some(Color::Yellow),
            "primary" => Some(Color::Primary),
            "secondary" => Some(Color::Secondary),
            _ => Color::from_hex(color_str).ok(),
        };
        self
    }

    #[wasm_bindgen(method)]
    pub fn style(mut self, style_str: &str) -> Self {
        self.props.style = match style_str.to_lowercase().as_str() {
            "solid" => Some(DividerStyle::Solid),
            "dashed" => Some(DividerStyle::Dashed),
            "dotted" => Some(DividerStyle::Dotted),
            "gradient" => Some(DividerStyle::Gradient),
            "inset" => Some(DividerStyle::Inset),
            "outset" => Some(DividerStyle::Outset),
            _ => None,
        };
        self
    }

    #[wasm_bindgen(method)]
    pub fn padding(mut self, value: f32) -> Self {
        self.props.padding = Some(value);
        self
    }

    #[wasm_bindgen(method)]
    pub fn label(mut self, text: &str) -> Self {
        self.props.label = Some(text.to_string());
        self
    }

    #[wasm_bindgen(method)]
    pub fn label_color(mut self, color_str: &str) -> Self {
        self.props.label_color = match color_str.to_lowercase().as_str() {
            "white" => Some(Color::White),
            "black" => Some(Color::Black),
            "gray" => Some(Color::Gray),
            "lightgray" => Some(Color::LightGray),
            "darkgray" => Some(Color::DarkGray),
            "red" => Some(Color::Red),
            "green" => Some(Color::Green),
            "blue" => Some(Color::Blue),
            "yellow" => Some(Color::Yellow),
            "primary" => Some(Color::Primary),
            "secondary" => Some(Color::Secondary),
            _ => Color::from_hex(color_str).ok(),
        };
        self
    }

    #[wasm_bindgen(method)]
    pub fn label_position(mut self, position_str: &str) -> Self {
        self.props.label_position = match position_str.to_lowercase().as_str() {
            "left" => Some(LabelPosition::Left),
            "center" => Some(LabelPosition::Center),
            "right" => Some(LabelPosition::Right),
            "overlay" => Some(LabelPosition::Overlay),
            _ => None,
        };
        self
    }

    #[wasm_bindgen(method)]
    pub fn label_padding(mut self, value: f32) -> Self {
        self.props.label_padding = Some(value);
        self
    }

    #[wasm_bindgen(method)]
    pub fn label_background(mut self, color_str: &str) -> Self {
        self.props.label_background = match color_str.to_lowercase().as_str() {
            "white" => Some(Color::White),
            "black" => Some(Color::Black),
            "gray" => Some(Color::Gray),
            "lightgray" => Some(Color::LightGray),
            "darkgray" => Some(Color::DarkGray),
            "red" => Some(Color::Red),
            "green" => Some(Color::Green),
            "blue" => Some(Color::Blue),
            "yellow" => Some(Color::Yellow),
            "primary" => Some(Color::Primary),
            "secondary" => Some(Color::Secondary),
            _ => Color::from_hex(color_str).ok(),
        };
        self
    }

    #[wasm_bindgen(method)]
    pub fn build(&self) -> Result<JsValue, JsValue> {
        let component = UIComponent::Divider(self.props.clone());

        serde_json::to_string(&component)
            .map(|s| JsValue::from_str(&s))
            .map_err(|e| JsValue::from_str(&format!("Serialization error: {}", e)))
    }
}

// Predefined color scheme functions
#[wasm_bindgen]
pub fn light_divider() -> Result<JsValue, JsValue> {
    let divider_props = milost_ui::components::divider::divider_color_schemes::light();
    
    serde_json::to_string(&UIComponent::Divider(divider_props))
        .map(|s| JsValue::from_str(&s))
        .map_err(|e| JsValue::from_str(&format!("Serialization error: {}", e)))
}

#[wasm_bindgen]
pub fn dark_divider() -> Result<JsValue, JsValue> {
    let divider_props = milost_ui::components::divider::divider_color_schemes::dark();
    
    serde_json::to_string(&UIComponent::Divider(divider_props))
        .map(|s| JsValue::from_str(&s))
        .map_err(|e| JsValue::from_str(&format!("Serialization error: {}", e)))
}

#[wasm_bindgen]
pub fn accent_divider() -> Result<JsValue, JsValue> {
    let divider_props = milost_ui::components::divider::divider_color_schemes::accent();
    
    serde_json::to_string(&UIComponent::Divider(divider_props))
        .map(|s| JsValue::from_str(&s))
        .map_err(|e| JsValue::from_str(&format!("Serialization error: {}", e)))
}

#[wasm_bindgen]
pub fn gradient_divider() -> Result<JsValue, JsValue> {
    let divider_props = milost_ui::components::divider::divider_color_schemes::gradient();
    
    serde_json::to_string(&UIComponent::Divider(divider_props))
        .map(|s| JsValue::from_str(&s))
        .map_err(|e| JsValue::from_str(&format!("Serialization error: {}", e)))
}