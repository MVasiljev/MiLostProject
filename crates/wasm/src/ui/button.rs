// button.rs

use milost_ui::{
    components::{
        UIComponent,
        button::{ButtonProps, ButtonStyle, ButtonSize, ButtonState},
    },
    shared::{
        Color, Gradient, GradientStop, GradientType, 
        BorderStyle, TextAlign, TextTransform, Overflow, 
        LoadingIndicatorType, EdgeInsets
    },
    events::EventType,
};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct Button {
    props: ButtonProps,
}

#[wasm_bindgen]
impl Button {
    #[wasm_bindgen(constructor)]
    pub fn new(label: &str) -> Self {
        Self {
            props: ButtonProps::new(label.to_string()),
        }
    }

    #[wasm_bindgen]
    pub fn on_tap(mut self, handler_id: &str) -> Self {
        self.props = self.props.with_on_tap(handler_id);
        self
    }

    #[wasm_bindgen]
    pub fn style(mut self, style_name: &str) -> Self {
        let style = match style_name.to_lowercase().as_str() {
            "primary" => ButtonStyle::Primary,
            "secondary" => ButtonStyle::Secondary,
            "danger" => ButtonStyle::Danger,
            "success" => ButtonStyle::Success,
            "outline" => ButtonStyle::Outline,
            "text" => ButtonStyle::Text,
            "custom" => ButtonStyle::Custom,
            _ => ButtonStyle::Primary,
        };
        
        self.props = self.props.with_style(style);
        self
    }

    #[wasm_bindgen]
    pub fn size(mut self, size_name: &str) -> Self {
        let size = match size_name.to_lowercase().as_str() {
            "small" => ButtonSize::Small,
            "medium" => ButtonSize::Medium,
            "large" => ButtonSize::Large,
            "custom" => ButtonSize::Custom,
            _ => ButtonSize::Medium,
        };
        
        self.props = self.props.with_size(size);
        self
    }

    #[wasm_bindgen]
    pub fn disabled(mut self, disabled: bool) -> Self {
        self.props = self.props.with_disabled(disabled);
        self
    }

    #[wasm_bindgen]
    pub fn background_color(mut self, color: &str) -> Self {
        self.props = self.props.with_background_color(Color::from_hex(color));
        self
    }

    #[wasm_bindgen]
    pub fn text_color(mut self, color: &str) -> Self {
        self.props = self.props.with_text_color(Color::from_hex(color));
        self
    }

    #[wasm_bindgen]
    pub fn corner_radius(mut self, radius: f32) -> Self {
        self.props = self.props.with_corner_radius(radius);
        self
    }

    #[wasm_bindgen]
    pub fn padding(mut self, padding: f32) -> Self {
        self.props = self.props.with_padding(padding);
        self
    }

    #[wasm_bindgen]
    pub fn icon(mut self, icon_name: &str, position: Option<String>) -> Self {
        self.props = self.props.with_icon(icon_name.to_string(), position);
        self
    }

    #[wasm_bindgen]
    pub fn state(mut self, state_name: &str) -> Self {
        let state = match state_name.to_lowercase().as_str() {
            "normal" => ButtonState::Normal,
            "pressed" => ButtonState::Pressed,
            "focused" => ButtonState::Focused,
            "hovered" => ButtonState::Hovered,
            "disabled" => ButtonState::Disabled,
            _ => ButtonState::Normal,
        };
        
        self.props = self.props.with_button_state(state);
        self
    }

    #[wasm_bindgen]
    pub fn elevation(mut self, elevation: f32) -> Self {
        self.props = self.props.with_elevation(elevation);
        self
    }

    #[wasm_bindgen]
    pub fn opacity(mut self, opacity: f32) -> Self {
        self.props = self.props.with_opacity(opacity);
        self
    }

    #[wasm_bindgen]
    pub fn shadow(mut self, radius: f32, color: &str, offset_x: f32, offset_y: f32) -> Self {
        self.props = self.props.with_shadow(
            Color::from_hex(color), 
            (offset_x, offset_y), 
            radius
        );
        self
    }

    #[wasm_bindgen]
    pub fn gradient(mut self, colors_json: &str, is_radial: bool) -> Self {
        // Parse colors from JSON
        let colors: Vec<Color> = match serde_json::from_str(colors_json) {
            Ok(colors) => colors,
            Err(_) => return self,
        };
        
        if colors.len() < 2 {
            return self;
        }
        
        let stops: Vec<GradientStop> = colors.iter().enumerate().map(|(i, color)| {
            GradientStop {
                color: color.to_css_string(),
                position: i as f32 / (colors.len() - 1) as f32,
                name: None,
            }
        }).collect();
        
        let gradient_type = if is_radial { 
            GradientType::Radial 
        } else { 
            GradientType::Linear 
        };
        
        let mut gradient = Gradient {
            stops,
            start_point: (0.0, 0.0),
            end_point: (1.0, 1.0),
            gradient_type,
            angle: None,
            spread_method: None,
            name: None,
            custom_props: None,
        };
        
        if is_radial {
            gradient.start_point = (0.5, 0.5);
            gradient.end_point = (1.0, 1.0);
        }
        
        self.props = self.props.with_gradient(gradient);
        self
    }

    #[wasm_bindgen]
    pub fn border(mut self, width: f32, color: &str, style: Option<String>) -> Self {
        let border_style = style.map(|s| match s.to_lowercase().as_str() {
            "solid" => BorderStyle::Solid,
            "dashed" => BorderStyle::Dashed,
            "dotted" => BorderStyle::Dotted,
            "none" => BorderStyle::None,
            _ => BorderStyle::Solid,
        });
        
        self.props = self.props.with_border(
            width, 
            Color::from_hex(color),
            border_style.unwrap_or(BorderStyle::Solid)
        );
        
        self
    }

    #[wasm_bindgen]
    pub fn text_style(mut self, transform: Option<String>, align: Option<String>, font_size: Option<f32>) -> Self {
        let transform_enum = transform.map(|t| match t.to_lowercase().as_str() {
            "uppercase" => TextTransform::Uppercase,
            "lowercase" => TextTransform::Lowercase,
            "capitalize" => TextTransform::Capitalize,
            _ => TextTransform::None,
        });
        
        let align_enum = align.map(|a| match a.to_lowercase().as_str() {
            "left" => TextAlign::Left,
            "center" => TextAlign::Center,
            "right" => TextAlign::Right,
            _ => TextAlign::Center,
        });
        
        self.props = self.props.with_text_style(
            transform_enum,
            align_enum,
            None, // font_weight
            font_size,
            None, // letter_spacing
            None  // overflow
        );
        
        self
    }

    #[wasm_bindgen]
    pub fn dimensions(mut self, min_width: Option<f32>, max_width: Option<f32>, fixed_width: Option<f32>, fixed_height: Option<f32>) -> Self {
        let edge_insets = None; // EdgeInsets can be set in a separate method
        let alignment = None;   // Alignment can be set in a separate method
        
        self.props = self.props.with_layout(
            min_width,
            max_width,
            fixed_width,
            fixed_height,
            alignment,
            edge_insets
        );
        
        self
    }

    #[wasm_bindgen]
    pub fn edge_insets(mut self, top: f32, right: f32, bottom: f32, left: f32) -> Self {
        let insets = EdgeInsets::new(top, right, bottom, left);
        self.props.edge_insets = Some(insets);
        self
    }

    #[wasm_bindgen]
    pub fn loading(mut self, is_loading: bool, indicator_type: Option<String>, indicator_color: Option<String>, hide_text: bool) -> Self {
        let indicator = indicator_type.map(|t| match t.to_lowercase().as_str() {
            "spinner" => LoadingIndicatorType::Spinner,
            "dotpulse" => LoadingIndicatorType::DotPulse,
            "barpulse" => LoadingIndicatorType::BarPulse,
            "custom" => LoadingIndicatorType::Custom,
            _ => LoadingIndicatorType::Spinner,
        });
        
        let color = indicator_color.map(|c| Color::from_hex(&c));
        
        self.props = self.props.with_loading(
            is_loading,
            indicator,
            color,
            None, // indicator_size
            Some(hide_text)
        );
        
        self
    }

    #[wasm_bindgen]
    pub fn event_handlers(mut self, on_double_tap: Option<String>, on_long_press: Option<String>, 
                          on_hover_enter: Option<String>, on_hover_exit: Option<String>) -> Self {
        self.props = self.props.with_event_handlers(
            on_double_tap.as_deref(),
            on_long_press.as_deref(),
            on_hover_enter.as_deref(),
            on_hover_exit.as_deref(),
            None, // on_focus
            None  // on_blur
        );
        
        self
    }

    #[wasm_bindgen]
    pub fn accessibility(mut self, label: Option<String>, hint: Option<String>, is_element: Option<bool>) -> Self {
        self.props = self.props.with_accessibility(label, hint, is_element);
        self
    }

    #[wasm_bindgen]
    pub fn press_effect(mut self, scale: f32, duration: f32) -> Self {
        self.props = self.props.with_press_effect(
            true,
            Some(scale),
            None, // color_change
            None, // offset
            Some(duration)
        );
        
        self
    }

    #[wasm_bindgen]
    pub fn to_json(&self) -> String {
        serde_json::to_string(&UIComponent::Button(self.props.clone()))
            .unwrap_or_else(|_| "{}".to_string())
    }
}

// Factory methods for common button patterns
#[wasm_bindgen]
pub fn create_primary_button(label: &str, handler_id: &str) -> Button {
    Button::new(label)
        .style("primary")
        .on_tap(handler_id)
}

#[wasm_bindgen]
pub fn create_secondary_button(label: &str, handler_id: &str) -> Button {
    Button::new(label)
        .style("secondary")
        .on_tap(handler_id)
}

#[wasm_bindgen]
pub fn create_danger_button(label: &str, handler_id: &str) -> Button {
    Button::new(label)
        .style("danger")
        .on_tap(handler_id)
}

#[wasm_bindgen]
pub fn create_loading_button(label: &str, is_loading: bool, handler_id: &str) -> Button {
    Button::new(label)
        .on_tap(handler_id)
        .loading(is_loading, Some("spinner".to_string()), None, false)
}

#[wasm_bindgen]
pub fn create_icon_button(label: &str, icon: &str, handler_id: &str) -> Button {
    Button::new(label)
        .on_tap(handler_id)
        .icon(icon, Some("left".to_string()))
}

#[wasm_bindgen]
pub fn create_gradient_button(label: &str, colors_json: &str, handler_id: &str) -> Button {
    Button::new(label)
        .on_tap(handler_id)
        .gradient(colors_json, false)
}