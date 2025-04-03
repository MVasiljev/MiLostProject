use wasm_bindgen::prelude::*;
use wasm_bindgen::JsValue;
use milost_ui::{ButtonProps, UIComponent, EventHandler, ButtonStyle};

#[wasm_bindgen]
pub struct ButtonBuilder {
    label: String,
    on_tap: Option<EventHandler>,
    disabled: Option<bool>,
    style: Option<ButtonStyle>,
    background_color: Option<String>,
    text_color: Option<String>,
    border_color: Option<String>,
    corner_radius: Option<f32>,
    padding: Option<f32>,
    icon: Option<String>,
    icon_position: Option<String>,
}

#[wasm_bindgen]
impl ButtonBuilder {
    #[wasm_bindgen(constructor)]
    pub fn new(label: &str) -> Self {
        Self {
            label: label.to_string(),
            on_tap: None,
            disabled: None,
            style: None,
            background_color: None,
            text_color: None,
            border_color: None,
            corner_radius: None,
            padding: None,
            icon: None,
            icon_position: None,
        }
    }

    #[wasm_bindgen(method)]
    pub fn on_tap(mut self, handler_id: &str) -> Self {
        self.on_tap = Some(EventHandler {
            event_type: milost_ui::EventType::Tap,
            handler_id: handler_id.to_string(),
            data: None,
        });
        self
    }

    #[wasm_bindgen(method)]
    pub fn disabled(mut self, is_disabled: bool) -> Self {
        self.disabled = Some(is_disabled);
        self
    }

    #[wasm_bindgen(method)]
    pub fn style(mut self, style_str: &str) -> Self {
        self.style = match style_str {
            "Primary" => Some(ButtonStyle::Primary),
            "Secondary" => Some(ButtonStyle::Secondary),
            "Danger" => Some(ButtonStyle::Danger),
            "Success" => Some(ButtonStyle::Success),
            "Outline" => Some(ButtonStyle::Outline),
            "Text" => Some(ButtonStyle::Text),
            "Custom" => Some(ButtonStyle::Custom),
            _ => None,
        };
        self
    }

    #[wasm_bindgen(method)]
    pub fn background_color(mut self, color: &str) -> Self {
        self.background_color = Some(color.to_string());
        self
    }

    #[wasm_bindgen(method)]
    pub fn text_color(mut self, color: &str) -> Self {
        self.text_color = Some(color.to_string());
        self
    }

    #[wasm_bindgen(method)]
    pub fn border_color(mut self, color: &str) -> Self {
        self.border_color = Some(color.to_string());
        self
    }

    #[wasm_bindgen(method)]
    pub fn corner_radius(mut self, radius: f32) -> Self {
        self.corner_radius = Some(radius);
        self
    }

    #[wasm_bindgen(method)]
    pub fn padding(mut self, pad: f32) -> Self {
        self.padding = Some(pad);
        self
    }

    #[wasm_bindgen(method)]
    pub fn icon(mut self, icon: &str) -> Self {
        self.icon = Some(icon.to_string());
        self
    }

    #[wasm_bindgen(method)]
    pub fn icon_position(mut self, position: &str) -> Self {
        self.icon_position = Some(position.to_string());
        self
    }

    #[wasm_bindgen(method)]
    pub fn build(&self) -> Result<JsValue, JsValue> {
        let component = UIComponent::Button(ButtonProps {
            label: self.label.clone(),
            on_tap: self.on_tap.clone(),
            disabled: self.disabled,
            style: self.style.clone(),
            background_color: self.background_color.clone(),
            text_color: self.text_color.clone(),
            border_color: self.border_color.clone(),
            corner_radius: self.corner_radius,
            padding: self.padding,
            icon: self.icon.clone(),
            icon_position: self.icon_position.clone(),
        });

        serde_json::to_string(&component)
            .map(|s| JsValue::from_str(&s))
            .map_err(|e| JsValue::from_str(&format!("Serialization error: {}", e)))
    }
}