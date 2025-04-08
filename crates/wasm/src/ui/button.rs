use milost_ui::components::UIComponent;
use wasm_bindgen::prelude::*;
use serde::{Serialize, Deserialize};
use milost_ui::components::button::ButtonEventHandler as MilostButtonEventHandler;

use milost_ui::{
    components::{ButtonProps, ButtonStyle}, 
    events::EventType, 
    shared::{
        Color, Gradient, 
        GradientStop, GradientType, 
        LoadingIndicatorType, 
        TextAlign, 
        TextTransform
    }
};

// Button Hooks
mod button_hooks {
    use super::*;

    // Event handler hook for buttons
    pub fn use_button_event_handler(
        event_type: EventType, 
        handler_id: Option<String>
    ) -> Option<ButtonEventHandler> {
        handler_id.map(|id| ButtonEventHandler {
            event_type,
            handler_id: id,
        })
    }

    // Style configuration hook
    pub fn use_button_style(
        base_style: Option<ButtonStyleVariant>,
        custom_colors: Option<(Color, Color)>
    ) -> ButtonStyleConfig {
        ButtonStyleConfig {
            base_style,
            custom_colors,
        }
    }

    // Loading state hook
    pub fn use_loading_state(
        is_loading: bool,
        indicator_type: Option<LoadingIndicatorType>,
        indicator_color: Option<Color>
    ) -> LoadingConfig {
        LoadingConfig {
            is_loading,
            indicator_type,
            indicator_color,
        }
    }
}

// Button Style Variants
#[derive(Debug, Serialize, Deserialize, Clone, PartialEq)]
pub enum ButtonStyleVariant {
    Primary,
    Secondary,
    Danger,
    Success,
    Outline,
    Text,
    Custom,
}

// Style Configuration Structure
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ButtonStyleConfig {
    base_style: Option<ButtonStyleVariant>,
    custom_colors: Option<(Color, Color)>,
}

// Loading Configuration Structure
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct LoadingConfig {
    is_loading: bool,
    indicator_type: Option<LoadingIndicatorType>,
    indicator_color: Option<Color>,
}
// Button Event Handler for WASM Compatibility
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ButtonEventHandler {
    pub event_type: EventType,
    pub handler_id: String,
}

impl From<ButtonEventHandler> for MilostButtonEventHandler {
    fn from(handler: ButtonEventHandler) -> Self {
        MilostButtonEventHandler {
            event_type: handler.event_type,
            handler_id: handler.handler_id,
        }
    }
}

// Buttons Component Types
#[derive(Debug, Serialize, Deserialize, Clone)]
pub enum ButtonComponentType {
    Regular,
    Icon,
    Gradient,
    Loading,
}

// Button Builder with Enhanced Configuration
#[wasm_bindgen]
pub struct ButtonBuilder {
    props: ButtonProps,
}

#[wasm_bindgen]
impl ButtonBuilder {
    #[wasm_bindgen(constructor)]
    pub fn new(label: &str) -> Self {
        Self {
            props: ButtonProps::new(label.to_string()),
        }
    }

    // Event Handling Methods
    #[wasm_bindgen(method)]
    pub fn on_tap(mut self, handler_id: &str) -> Self {
        let event_handler = button_hooks::use_button_event_handler(
            EventType::Tap, 
            Some(handler_id.to_string())
        );
        if let Some(handler) = event_handler {
            let converted_handler = handler.into();
            self.props.on_tap = Some(converted_handler);
        }
        self
    }

    // Styling Methods
    #[wasm_bindgen(method)]
    pub fn style(mut self, style_str: &str) -> Self {
        let style_variant = match style_str {
            "Primary" => Some(ButtonStyleVariant::Primary),
            "Secondary" => Some(ButtonStyleVariant::Secondary),
            "Danger" => Some(ButtonStyleVariant::Danger),
            "Success" => Some(ButtonStyleVariant::Success),
            "Outline" => Some(ButtonStyleVariant::Outline),
            "Text" => Some(ButtonStyleVariant::Text),
            "Custom" => Some(ButtonStyleVariant::Custom),
            _ => None,
        };

        let style_config = button_hooks::use_button_style(
            style_variant, 
            None
        );

        // Map style variant to button style
        self.props.style = style_config.base_style.map(|s| match s {
            ButtonStyleVariant::Primary => ButtonStyle::Primary,
            ButtonStyleVariant::Secondary => ButtonStyle::Secondary,
            ButtonStyleVariant::Danger => ButtonStyle::Danger,
            ButtonStyleVariant::Success => ButtonStyle::Success,
            ButtonStyleVariant::Outline => ButtonStyle::Outline,
            ButtonStyleVariant::Text => ButtonStyle::Text,
            ButtonStyleVariant::Custom => ButtonStyle::Custom,
        });

        self
    }

    // Gradient Method
    #[wasm_bindgen(method)]
    pub fn gradient(mut self, colors: Vec<JsValue>) -> Self {
        let parsed_colors: Vec<Color> = colors
            .iter()
            .filter_map(|color_val| 
                color_val.as_string()
                    .and_then(|hex| Some(Color::from_hex(&hex))))
            .collect();

        if !parsed_colors.is_empty() {
            let gradient = Gradient {
                stops: parsed_colors
                    .iter()
                    .enumerate()
                    .map(|(i, color)| GradientStop {
                        color: color.to_css_string(),
                        position: i as f32 / (parsed_colors.len() - 1) as f32,
                        name: None,
                    })
                    .collect(),
                start_point: (0.0, 0.0),
                end_point: (1.0, 0.0),
                gradient_type: GradientType::Linear,
                angle: None,
                spread_method: None,
                name: None,
                custom_props: None,
            };

            self.props.gradient = Some(gradient);
        }

        self
    }

    // Loading State Method
    #[wasm_bindgen(method)]
    pub fn loading(mut self, is_loading: bool, indicator_type: Option<String>) -> Self {
        let loading_config = button_hooks::use_loading_state(
            is_loading, 
            indicator_type.as_deref().map(|t| match t {
                "spinner" => LoadingIndicatorType::Spinner,
                "dotPulse" => LoadingIndicatorType::DotPulse,
                "barPulse" => LoadingIndicatorType::BarPulse,
                "custom" => LoadingIndicatorType::Custom,
                _ => LoadingIndicatorType::Spinner,
            }),
            None
        );

        self.props.is_loading = Some(loading_config.is_loading);
        self.props.loading_indicator_type = loading_config.indicator_type;

        self
    }

    // Text Styling Method
    #[wasm_bindgen(method)]
    pub fn text_style(
        mut self, 
        transform: Option<String>,
        align: Option<String>,
        weight: Option<String>
    ) -> Self {
        self.props.text_transform = transform.as_deref().map(|t| match t {
            "uppercase" => TextTransform::Uppercase,
            "lowercase" => TextTransform::Lowercase,
            "capitalize" => TextTransform::Capitalize,
            _ => TextTransform::None,
        });

        self.props.text_align = align.as_deref().map(|a| match a {
            "left" => TextAlign::Left,
            "center" => TextAlign::Center,
            "right" => TextAlign::Right,
            _ => TextAlign::Center,
        });

        self
    }

    // Build Method
    #[wasm_bindgen(method)]
    pub fn build(&self) -> Result<JsValue, JsValue> {
        let component = UIComponent::Button(self.props.clone());

        JsValue::from_serde(&component)
            .map_err(|e| JsValue::from_str(&format!("Serialization error: {}", e)))
    }
}

// Factory Functions for Common Button Patterns
#[wasm_bindgen]
pub fn create_primary_button(label: &str, handler_id: &str) -> Result<JsValue, JsValue> {
    ButtonBuilder::new(label)
        .style("Primary")
        .on_tap(handler_id)
        .build()
}

#[wasm_bindgen]
pub fn create_loading_button(label: &str, is_loading: bool) -> Result<JsValue, JsValue> {
    ButtonBuilder::new(label)
        .loading(is_loading, Some("spinner".to_string()))
        .build()
}

#[wasm_bindgen]
pub fn create_gradient_button(label: &str, colors: Vec<JsValue>) -> Result<JsValue, JsValue> {
    ButtonBuilder::new(label)
        .gradient(colors)
        .build()
}