use wasm_bindgen::prelude::*;
use serde::{Serialize, Deserialize};
use milost_ui::{
    Alignment, BorderStyle, ButtonProps, ButtonSize, ButtonState, ButtonStyle, Color, EdgeInsets, EventType, FontWeight, Gradient, GradientStop, LoadingIndicatorType, Overflow, TextAlign, TextTransform, UIComponent
};

/// WASM-friendly Button Builder to create flexible UI buttons
#[wasm_bindgen]
pub struct ButtonBuilder {
    props: ButtonProps,
}

#[wasm_bindgen]
impl ButtonBuilder {
    /// Create a new button with a given label
    #[wasm_bindgen(constructor)]
    pub fn new(label: &str) -> Self {
        Self {
            props: ButtonProps::new(label.to_string()),
        }
    }

    /// Set the tap event handler
    #[wasm_bindgen(method)]
    pub fn on_tap(mut self, handler_id: &str) -> Self {
        self.props.on_tap = Some(ButtonEventHandler {
            event_type: EventType::Tap,
            handler_id: handler_id.to_string(),
        });
        self
    }

    /// Configure button style
    #[wasm_bindgen(method)]
    pub fn style(mut self, style_str: &str) -> Self {
        self.props.style = match style_str {
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

    /// Set button size
    #[wasm_bindgen(method)]
    pub fn size(mut self, size_str: &str) -> Self {
        self.props.size = match size_str {
            "Small" => Some(ButtonSize::Small),
            "Medium" => Some(ButtonSize::Medium),
            "Large" => Some(ButtonSize::Large),
            "Custom" => Some(ButtonSize::Custom),
            _ => None,
        };
        self
    }

    /// Set background color
    #[wasm_bindgen(method)]
    pub fn background_color(mut self, color_hex: &str) -> Self {
        self.props.background_color = Some(Color::from_hex(color_hex));
        self
    }

    /// Set text color
    #[wasm_bindgen(method)]
    pub fn text_color(mut self, color_hex: &str) -> Self {
        self.props.text_color = Some(Color::from_hex(color_hex));
        self
    }

    /// Set border color and width
    #[wasm_bindgen(method)]
    pub fn border(mut self, width: f32, color_hex: &str, style_str: &str) -> Self {
        self.props.border_width = Some(width);
        self.props.border_color = Some(Color::from_hex(color_hex));
        self.props.border_style = match style_str {
            "Solid" => Some(BorderStyle::Solid),
            "Dashed" => Some(BorderStyle::Dashed),
            "Dotted" => Some(BorderStyle::Dotted),
            "None" => Some(BorderStyle::None),
            _ => None,
        };
        self
    }

    /// Set corner radius
    #[wasm_bindgen(method)]
    pub fn corner_radius(mut self, radius: f32) -> Self {
        self.props.corner_radius = Some(radius);
        self
    }

    /// Set padding
    #[wasm_bindgen(method)]
    pub fn padding(mut self, pad: f32) -> Self {
        self.props.padding = Some(pad);
        self
    }

    /// Add an icon
    #[wasm_bindgen(method)]
    pub fn icon(mut self, icon: &str, position: Option<String>) -> Self {
        self.props.icon = Some(icon.to_string());
        if let Some(pos) = position {
            self.props.icon_position = Some(pos);
        }
        self
    }

    /// Set text styling
    #[wasm_bindgen(method)]
    pub fn text_style(
        mut self, 
        transform: Option<&str>,
        align: Option<&str>,
        weight: Option<&str>,
        size: Option<f32>,
        letter_spacing: Option<f32>
    ) -> Self {
        // Text transform
        self.props.text_transform = transform.map(|t| match t {
            "none" => TextTransform::None,
            "uppercase" => TextTransform::Uppercase,
            "lowercase" => TextTransform::Lowercase,
            "capitalize" => TextTransform::Capitalize,
            _ => TextTransform::None,
        });

        // Text alignment
        self.props.text_align = align.map(|a| match a {
            "left" => TextAlign::Left,
            "center" => TextAlign::Center,
            "right" => TextAlign::Right,
            _ => TextAlign::Left,
        });

        // Font weight
        self.props.font_weight = weight.map(|w| match w {
            "thin" => FontWeight::Thin,
            "extraLight" => FontWeight::ExtraLight,
            "light" => FontWeight::Light,
            "regular" => FontWeight::Regular,
            "medium" => FontWeight::Medium,
            "semiBold" => FontWeight::SemiBold,
            "bold" => FontWeight::Bold,
            "extraBold" => FontWeight::ExtraBold,
            "black" => FontWeight::Black,
            _ => FontWeight::Regular,
        });

        // Additional text styling
        self.props.font_size = size;
        self.props.letter_spacing = letter_spacing;

        self
    }

    /// Set loading state
    #[wasm_bindgen(method)]
    pub fn loading(
        mut self, 
        is_loading: bool, 
        indicator_type: Option<&str>,
        indicator_color: Option<&str>,
        indicator_size: Option<f32>
    ) -> Self {
        self.props.is_loading = Some(is_loading);
        
        // Loading indicator type
        self.props.loading_indicator_type = indicator_type.map(|t| match t {
            "spinner" => LoadingIndicatorType::Spinner,
            "dotPulse" => LoadingIndicatorType::DotPulse,
            "barPulse" => LoadingIndicatorType::BarPulse,
            "custom" => LoadingIndicatorType::Custom,
            _ => LoadingIndicatorType::Spinner,
        });

        // Loading indicator color
        if let Some(color) = indicator_color {
            self.props.loading_indicator_color = Some(Color::from_hex(color));
        }

        // Loading indicator size
        self.props.loading_indicator_size = indicator_size;

        self
    }

    /// Set accessibility properties
    #[wasm_bindgen(method)]
    pub fn accessibility(
        mut self, 
        label: Option<&str>, 
        hint: Option<&str>, 
        is_element: Option<bool>
    ) -> Self {
        if let Some(l) = label {
            self.props.accessibility_label = Some(l.to_string());
        }
        if let Some(h) = hint {
            self.props.accessibility_hint = Some(h.to_string());
        }
        if let Some(is_acc_elem) = is_element {
            self.props.is_accessibility_element = Some(is_acc_elem);
        }
        self
    }

    /// Add gradient stops
    #[wasm_bindgen(method)]
    pub fn add_gradient_stop(mut self, color: &str, position: f32) -> Self {
        // Initialize gradient if not already present
        if self.props.gradient.is_none() {
            self.props.gradient = Some(Gradient {
                stops: Vec::new(),
                start_point: (0.0, 0.0),
                end_point: (1.0, 0.0),
                gradient_type: GradientType::Linear,
                angle: None,
                spread_method: None,
                name: None,
                custom_props: None,
            });
        }
        
        // Add the stop
        if let Some(ref mut gradient) = self.props.gradient {
            gradient.stops.push(GradientStop {
                color: color.to_string(),
                position,
                name: None,
            });
        }
        
        self
    }

    /// Build the button
    #[wasm_bindgen(method)]
    pub fn build(&self) -> Result<JsValue, JsValue> {
        let component = UIComponent::Button(self.props.clone());

        serde_json::to_string(&component)
            .map(|s| JsValue::from_str(&s))
            .map_err(|e| JsValue::from_str(&format!("Serialization error: {}", e)))
    }
}

// Companion structs and enums for WASM compatibility
#[wasm_bindgen]
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ButtonEventHandler {
    pub event_type: EventType,
    pub handler_id: String,
}

/// Represents the possible button styles
#[wasm_bindgen]
#[derive(Debug, Serialize, Deserialize, Clone)]
pub enum ButtonStyleEnum {
    Primary,
    Secondary,
    Danger,
    Success,
    Outline,
    Text,
    Custom,
}

/// Represents the possible button sizes
#[wasm_bindgen]
#[derive(Debug, Serialize, Deserialize, Clone)]
pub enum ButtonSizeEnum {
    Small,
    Medium,
    Large,
    Custom,
}

/// Represents the possible button states
#[wasm_bindgen]
#[derive(Debug, Serialize, Deserialize, Clone)]
pub enum ButtonStateEnum {
    Normal,
    Pressed,
    Focused,
    Hovered,
    Disabled,
}