use wasm_bindgen::prelude::*;
use wasm_bindgen::JsValue;
use milost_ui::{
    ButtonProps, 
    UIComponent, 
    EventHandler, 
    ButtonStyle, 
    ButtonSize, 
    ButtonState,
    BorderStyle,
    TextTransform,
    TextAlign,
    FontWeight,
    LoadingIndicatorType,
    Overflow,
    Gradient,
    GradientStop,
    EdgeInsets,
    Alignment,
    EventType
};

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

    // Basic properties
    #[wasm_bindgen(method)]
    pub fn on_tap(mut self, handler_id: &str) -> Self {
        self.props.on_tap = Some(EventHandler {
            event_type: EventType::Tap,
            handler_id: handler_id.to_string(),
            data: None,
        });
        self
    }

    #[wasm_bindgen(method)]
    pub fn disabled(mut self, is_disabled: bool) -> Self {
        self.props.disabled = Some(is_disabled);
        self
    }

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

    // Visual properties
    #[wasm_bindgen(method)]
    pub fn background_color(mut self, color: &str) -> Self {
        self.props.background_color = Some(color.to_string());
        self
    }

    #[wasm_bindgen(method)]
    pub fn text_color(mut self, color: &str) -> Self {
        self.props.text_color = Some(color.to_string());
        self
    }

    #[wasm_bindgen(method)]
    pub fn border_color(mut self, color: &str) -> Self {
        self.props.border_color = Some(color.to_string());
        self
    }

    #[wasm_bindgen(method)]
    pub fn corner_radius(mut self, radius: f32) -> Self {
        self.props.corner_radius = Some(radius);
        self
    }

    #[wasm_bindgen(method)]
    pub fn padding(mut self, pad: f32) -> Self {
        self.props.padding = Some(pad);
        self
    }

    #[wasm_bindgen(method)]
    pub fn icon(mut self, icon: &str, position: Option<String>) -> Self {
        self.props.icon = Some(icon.to_string());
        if let Some(pos) = position {
            self.props.icon_position = Some(pos);
        }
        self
    }

    // Button size
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

    // Enhancement: Shadow and elevation effects
    #[wasm_bindgen(method)]
    pub fn elevation(mut self, value: f32) -> Self {
        self.props.elevation = Some(value);
        self
    }

    #[wasm_bindgen(method)]
    pub fn opacity(mut self, value: f32) -> Self {
        self.props.opacity = Some(value);
        self
    }

    #[wasm_bindgen(method)]
    pub fn shadow(mut self, color: &str, offset_x: f32, offset_y: f32, radius: f32) -> Self {
        self.props.shadow_color = Some(color.to_string());
        self.props.shadow_offset = Some((offset_x, offset_y));
        self.props.shadow_radius = Some(radius);
        self
    }

    // Enhancement: Border customization
    #[wasm_bindgen(method)]
    pub fn border(mut self, width: f32, style: &str, color: &str) -> Self {
        self.props.border_width = Some(width);
        self.props.border_color = Some(color.to_string());
        self.props.border_style = match style {
            "Solid" => Some(BorderStyle::Solid),
            "Dashed" => Some(BorderStyle::Dashed),
            "Dotted" => Some(BorderStyle::Dotted),
            "None" => Some(BorderStyle::None),
            _ => None,
        };
        self
    }

    // Enhancement: Text styling
    #[wasm_bindgen(method)]
    pub fn text_transform(mut self, transform: &str) -> Self {
        self.props.text_transform = match transform {
            "none" => Some(TextTransform::None),
            "uppercase" => Some(TextTransform::Uppercase),
            "lowercase" => Some(TextTransform::Lowercase),
            "capitalize" => Some(TextTransform::Capitalize),
            _ => None,
        };
        self
    }

    #[wasm_bindgen(method)]
    pub fn text_align(mut self, align: &str) -> Self {
        self.props.text_align = match align {
            "left" => Some(TextAlign::Left),
            "center" => Some(TextAlign::Center),
            "right" => Some(TextAlign::Right),
            _ => None,
        };
        self
    }

    #[wasm_bindgen(method)]
    pub fn font_weight(mut self, weight: &str) -> Self {
        self.props.font_weight = match weight {
            "thin" => Some(FontWeight::Thin),
            "extraLight" => Some(FontWeight::ExtraLight),
            "light" => Some(FontWeight::Light),
            "regular" => Some(FontWeight::Regular),
            "medium" => Some(FontWeight::Medium),
            "semiBold" => Some(FontWeight::SemiBold),
            "bold" => Some(FontWeight::Bold),
            "extraBold" => Some(FontWeight::ExtraBold),
            "black" => Some(FontWeight::Black),
            _ => None,
        };
        self
    }

    #[wasm_bindgen(method)]
    pub fn font_size(mut self, size: f32) -> Self {
        self.props.font_size = Some(size);
        self
    }

    #[wasm_bindgen(method)]
    pub fn letter_spacing(mut self, spacing: f32) -> Self {
        self.props.letter_spacing = Some(spacing);
        self
    }

    #[wasm_bindgen(method)]
    pub fn overflow(mut self, overflow_type: &str) -> Self {
        self.props.overflow = match overflow_type {
            "visible" => Some(Overflow::Visible),
            "hidden" => Some(Overflow::Hidden),
            "scroll" => Some(Overflow::Scroll),
            "ellipsis" => Some(Overflow::Ellipsis),
            _ => None,
        };
        self
    }

    // Enhancement: Layout constraints
    #[wasm_bindgen(method)]
    pub fn min_width(mut self, width: f32) -> Self {
        self.props.min_width = Some(width);
        self
    }

    #[wasm_bindgen(method)]
    pub fn max_width(mut self, width: f32) -> Self {
        self.props.max_width = Some(width);
        self
    }

    #[wasm_bindgen(method)]
    pub fn fixed_width(mut self, width: f32) -> Self {
        self.props.fixed_width = Some(width);
        self
    }

    #[wasm_bindgen(method)]
    pub fn fixed_height(mut self, height: f32) -> Self {
        self.props.fixed_height = Some(height);
        self
    }

    #[wasm_bindgen(method)]
    pub fn alignment(mut self, alignment: &str) -> Self {
        self.props.alignment = match alignment {
            "topLeading" => Some(Alignment::TopLeading),
            "top" => Some(Alignment::Top),
            "topTrailing" => Some(Alignment::TopTrailing),
            "leading" => Some(Alignment::Leading),
            "center" => Some(Alignment::Center),
            "trailing" => Some(Alignment::Trailing),
            "bottomLeading" => Some(Alignment::BottomLeading),
            "bottom" => Some(Alignment::Bottom),
            "bottomTrailing" => Some(Alignment::BottomTrailing),
            _ => None,
        };
        self
    }

    #[wasm_bindgen(method)]
    pub fn edge_insets(mut self, top: f32, right: f32, bottom: f32, left: f32) -> Self {
        self.props.edge_insets = Some(EdgeInsets::new(top, right, bottom, left));
        self
    }

    // Enhancement: Loading state
    #[wasm_bindgen(method)]
    pub fn loading(mut self, is_loading: bool) -> Self {
        self.props.is_loading = Some(is_loading);
        self
    }

    #[wasm_bindgen(method)]
    pub fn loading_indicator_type(mut self, indicator_type: &str) -> Self {
        self.props.loading_indicator_type = match indicator_type {
            "spinner" => Some(LoadingIndicatorType::Spinner),
            "dotPulse" => Some(LoadingIndicatorType::DotPulse),
            "barPulse" => Some(LoadingIndicatorType::BarPulse),
            "custom" => Some(LoadingIndicatorType::Custom),
            _ => None,
        };
        self
    }

    #[wasm_bindgen(method)]
    pub fn loading_indicator_color(mut self, color: &str) -> Self {
        self.props.loading_indicator_color = Some(color.to_string());
        self
    }

    #[wasm_bindgen(method)]
    pub fn loading_indicator_size(mut self, size: f32) -> Self {
        self.props.loading_indicator_size = Some(size);
        self
    }

    #[wasm_bindgen(method)]
    pub fn hide_text_while_loading(mut self, hide: bool) -> Self {
        self.props.hide_text_while_loading = Some(hide);
        self
    }

    // Enhancement: Advanced event handlers
    #[wasm_bindgen(method)]
    pub fn on_double_tap(mut self, handler_id: &str) -> Self {
        self.props.on_double_tap = Some(EventHandler {
            event_type: EventType::DoubleTap,
            handler_id: handler_id.to_string(),
            data: None,
        });
        self
    }

    #[wasm_bindgen(method)]
    pub fn on_long_press(mut self, handler_id: &str) -> Self {
        self.props.on_long_press = Some(EventHandler {
            event_type: EventType::LongPress,
            handler_id: handler_id.to_string(),
            data: None,
        });
        self
    }

    #[wasm_bindgen(method)]
    pub fn on_hover_enter(mut self, handler_id: &str) -> Self {
        self.props.on_hover_enter = Some(EventHandler {
            event_type: EventType::HoverEnter,
            handler_id: handler_id.to_string(),
            data: None,
        });
        self
    }

    #[wasm_bindgen(method)]
    pub fn on_hover_exit(mut self, handler_id: &str) -> Self {
        self.props.on_hover_exit = Some(EventHandler {
            event_type: EventType::HoverExit,
            handler_id: handler_id.to_string(),
            data: None,
        });
        self
    }

    #[wasm_bindgen(method)]
    pub fn on_focus(mut self, handler_id: &str) -> Self {
        self.props.on_focus = Some(EventHandler {
            event_type: EventType::Focus,
            handler_id: handler_id.to_string(),
            data: None,
        });
        self
    }

    #[wasm_bindgen(method)]
    pub fn on_blur(mut self, handler_id: &str) -> Self {
        self.props.on_blur = Some(EventHandler {
            event_type: EventType::Blur,
            handler_id: handler_id.to_string(),
            data: None,
        });
        self
    }

    // Enhancement: Accessibility
    #[wasm_bindgen(method)]
    pub fn accessibility_label(mut self, label: &str) -> Self {
        self.props.accessibility_label = Some(label.to_string());
        self
    }

    #[wasm_bindgen(method)]
    pub fn accessibility_hint(mut self, hint: &str) -> Self {
        self.props.accessibility_hint = Some(hint.to_string());
        self
    }

    #[wasm_bindgen(method)]
    pub fn is_accessibility_element(mut self, is_element: bool) -> Self {
        self.props.is_accessibility_element = Some(is_element);
        self
    }

    // Enhancement: Press effects and animations
    #[wasm_bindgen(method)]
    pub fn animation_duration(mut self, duration: f32) -> Self {
        self.props.animation_duration = Some(duration);
        self
    }

    #[wasm_bindgen(method)]
    pub fn press_effect(mut self, enabled: bool) -> Self {
        self.props.press_effect = Some(enabled);
        self
    }

    #[wasm_bindgen(method)]
    pub fn press_scale(mut self, scale: f32) -> Self {
        self.props.press_scale = Some(scale);
        self
    }

    #[wasm_bindgen(method)]
    pub fn press_color_change(mut self, color: &str) -> Self {
        self.props.press_color_change = Some(color.to_string());
        self
    }

    #[wasm_bindgen(method)]
    pub fn press_offset(mut self, offset_x: f32, offset_y: f32) -> Self {
        self.props.press_offset = Some((offset_x, offset_y));
        self
    }

    // Enhancement: Gradient background
    #[wasm_bindgen(method)]
    pub fn add_gradient_stop(mut self, color: &str, position: f32) -> Self {
        // Initialize gradient if not already present
        if self.props.gradient.is_none() {
            self.props.gradient = Some(Gradient {
                stops: Vec::new(),
                start_point: (0.0, 0.0),
                end_point: (1.0, 0.0),
                is_radial: false,
            });
        }
        
        // Add the stop
        if let Some(ref mut gradient) = self.props.gradient {
            gradient.stops.push(GradientStop {
                color: color.to_string(),
                position,
            });
        }
        
        self
    }

    #[wasm_bindgen(method)]
    pub fn gradient_start_point(mut self, x: f32, y: f32) -> Self {
        // Initialize gradient if not already present
        if self.props.gradient.is_none() {
            self.props.gradient = Some(Gradient {
                stops: Vec::new(),
                start_point: (x, y),
                end_point: (1.0, 0.0),
                is_radial: false,
            });
        } else if let Some(ref mut gradient) = self.props.gradient {
            gradient.start_point = (x, y);
        }
        
        self
    }

    #[wasm_bindgen(method)]
    pub fn gradient_end_point(mut self, x: f32, y: f32) -> Self {
        // Initialize gradient if not already present
        if self.props.gradient.is_none() {
            self.props.gradient = Some(Gradient {
                stops: Vec::new(),
                start_point: (0.0, 0.0),
                end_point: (x, y),
                is_radial: false,
            });
        } else if let Some(ref mut gradient) = self.props.gradient {
            gradient.end_point = (x, y);
        }
        
        self
    }

    #[wasm_bindgen(method)]
    pub fn gradient_is_radial(mut self, is_radial: bool) -> Self {
        // Initialize gradient if not already present
        if self.props.gradient.is_none() {
            self.props.gradient = Some(Gradient {
                stops: Vec::new(),
                start_point: (0.0, 0.0),
                end_point: (1.0, 0.0),
                is_radial,
            });
        } else if let Some(ref mut gradient) = self.props.gradient {
            gradient.is_radial = is_radial;
        }
        
        self
    }
    
    #[wasm_bindgen(method)]
    pub fn build(&self) -> Result<JsValue, JsValue> {
        let component = UIComponent::Button(self.props.clone());

        serde_json::to_string(&component)
            .map(|s| JsValue::from_str(&s))
            .map_err(|e| JsValue::from_str(&format!("Serialization error: {}", e)))
    }
}