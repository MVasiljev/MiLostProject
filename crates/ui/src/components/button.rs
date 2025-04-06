use serde::{Serialize, Deserialize};
use crate::styles::{BorderStyle, Overflow};
use crate::{Alignment, Color, EdgeInsets, Gradient, LoadingIndicatorType};
use crate::events::EventType;

use super::text::{FontWeight, TextAlign, TextTransform};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub enum ButtonStyle {
    Primary,
    Secondary,
    Danger,
    Success,
    Outline,
    Text,
    Custom,
}

impl Default for ButtonStyle {
    fn default() -> Self {
        ButtonStyle::Primary
    }
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub enum ButtonSize {
    Small,
    Medium,
    Large,
    Custom,
}

impl Default for ButtonSize {
    fn default() -> Self {
        ButtonSize::Medium
    }
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub enum ButtonState {
    Normal,
    Pressed,
    Focused,
    Hovered,
    Disabled,
}

impl Default for ButtonState {
    fn default() -> Self {
        ButtonState::Normal
    }
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ButtonEventHandler {
    pub event_type: EventType,
    pub handler_id: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ButtonProps {
    pub label: String,
    pub on_tap: Option<ButtonEventHandler>,
    pub disabled: Option<bool>,
    pub style: Option<ButtonStyle>,
    
    pub background_color: Option<Color>,
    pub text_color: Option<Color>,
    pub border_color: Option<Color>,
    pub corner_radius: Option<f32>,
    pub padding: Option<f32>,
    pub icon: Option<String>,
    pub icon_position: Option<String>,
    
    pub size: Option<ButtonSize>,
    pub button_state: Option<ButtonState>,
    pub elevation: Option<f32>,
    pub opacity: Option<f32>,
    pub shadow_color: Option<Color>,
    pub shadow_offset: Option<(f32, f32)>,
    pub shadow_radius: Option<f32>,
    pub gradient: Option<Gradient>,
    pub border_width: Option<f32>,
    pub border_style: Option<BorderStyle>,
    
    pub text_transform: Option<TextTransform>,
    pub text_align: Option<TextAlign>,
    pub font_weight: Option<FontWeight>,
    pub font_size: Option<f32>,
    pub letter_spacing: Option<f32>,
    pub overflow: Option<Overflow>,
    
    pub min_width: Option<f32>,
    pub max_width: Option<f32>,
    pub fixed_width: Option<f32>,
    pub fixed_height: Option<f32>,
    pub alignment: Option<Alignment>,
    pub edge_insets: Option<EdgeInsets>,
    
    pub is_loading: Option<bool>,
    pub loading_indicator_type: Option<LoadingIndicatorType>,
    pub loading_indicator_color: Option<Color>,
    pub loading_indicator_size: Option<f32>,
    pub hide_text_while_loading: Option<bool>,
    
    pub on_double_tap: Option<ButtonEventHandler>,
    pub on_long_press: Option<ButtonEventHandler>,
    pub on_hover_enter: Option<ButtonEventHandler>,
    pub on_hover_exit: Option<ButtonEventHandler>,
    pub on_focus: Option<ButtonEventHandler>,
    pub on_blur: Option<ButtonEventHandler>,
    
    pub accessibility_label: Option<String>,
    pub accessibility_hint: Option<String>,
    pub is_accessibility_element: Option<bool>,
    
    pub animation_duration: Option<f32>,
    pub press_effect: Option<bool>,
    pub press_scale: Option<f32>,
    pub press_color_change: Option<Color>,
    pub press_offset: Option<(f32, f32)>,
}

impl Default for ButtonProps {
    fn default() -> Self {
        Self {
            label: String::new(),
            on_tap: None,
            disabled: None,
            style: Some(ButtonStyle::default()),
            
            background_color: None,
            text_color: None,
            border_color: None,
            corner_radius: None,
            padding: None,
            icon: None,
            icon_position: None,
            
            size: Some(ButtonSize::default()),
            button_state: Some(ButtonState::default()),
            elevation: None,
            opacity: None,
            shadow_color: None,
            shadow_offset: None,
            shadow_radius: None,
            gradient: None,
            border_width: None,
            border_style: None,
            
            text_transform: None,
            text_align: None,
            font_weight: None,
            font_size: None,
            letter_spacing: None,
            overflow: None,
            
            min_width: None,
            max_width: None,
            fixed_width: None,
            fixed_height: None,
            alignment: None,
            edge_insets: None,
            
            is_loading: None,
            loading_indicator_type: None,
            loading_indicator_color: None,
            loading_indicator_size: None,
            hide_text_while_loading: None,
            
            on_double_tap: None,
            on_long_press: None,
            on_hover_enter: None,
            on_hover_exit: None,
            on_focus: None,
            on_blur: None,
            
            accessibility_label: None,
            accessibility_hint: None,
            is_accessibility_element: None,
            
            animation_duration: None,
            press_effect: None,
            press_scale: None,
            press_color_change: None,
            press_offset: None,
        }
    }
}

impl ButtonProps {
    pub fn new(label: String) -> Self {
        Self {
            label,
            ..Default::default()
        }
    }
    
    pub fn with_on_tap(mut self, handler_id: &str) -> Self {
        self.on_tap = Some(ButtonEventHandler {
            event_type: EventType::Tap,
            handler_id: handler_id.to_string(),
        });
        self
    }
    
    pub fn with_disabled(mut self, disabled: bool) -> Self {
        self.disabled = Some(disabled);
        self
    }
    
    pub fn with_style(mut self, style: ButtonStyle) -> Self {
        self.style = Some(style);
        self
    }
    
    pub fn with_background_color(mut self, color: String) -> Self {
        self.background_color = Some(Color::from_hex(&color));
        self
    }
    
    pub fn with_text_color(mut self, color: String) -> Self {
        self.text_color = Some(Color::from_hex(&color));
        self
    }
    
    pub fn with_border_color(mut self, color: String) -> Self {
        self.border_color = Some(Color::from_hex(&color));
        self
    }
    
    pub fn with_corner_radius(mut self, radius: f32) -> Self {
        self.corner_radius = Some(radius);
        self
    }
    
    pub fn with_padding(mut self, padding: f32) -> Self {
        self.padding = Some(padding);
        self
    }
    
    pub fn with_icon(mut self, icon: String, position: Option<String>) -> Self {
        self.icon = Some(icon);
        if let Some(pos) = position {
            self.icon_position = Some(pos);
        }
        self
    }
    
    pub fn with_size(mut self, size: ButtonSize) -> Self {
        self.size = Some(size);
        self
    }
    
    pub fn with_button_state(mut self, state: ButtonState) -> Self {
        self.button_state = Some(state);
        self
    }
    
    pub fn with_elevation(mut self, elevation: f32) -> Self {
        self.elevation = Some(elevation);
        self
    }
    
    pub fn with_opacity(mut self, opacity: f32) -> Self {
        self.opacity = Some(opacity);
        self
    }
    
    pub fn with_shadow(mut self, color: String, offset: (f32, f32), radius: f32) -> Self {
        self.shadow_color = Some(Color::from_hex(&color));
        self.shadow_offset = Some(offset);
        self.shadow_radius = Some(radius);
        self
    }
    
    pub fn with_gradient(mut self, gradient: Gradient) -> Self {
        self.gradient = Some(gradient);
        self
    }
    
    pub fn with_border(mut self, width: f32, style: BorderStyle, color: String) -> Self {
        self.border_width = Some(width);
        self.border_style = Some(style);
        self.border_color = Some(Color::from_hex(&color));
        self
    }
    
    pub fn with_text_style(
        mut self, 
        transform: Option<TextTransform>,
        align: Option<TextAlign>,
        font_weight: Option<FontWeight>,
        font_size: Option<f32>,
        letter_spacing: Option<f32>,
        overflow: Option<Overflow>
    ) -> Self {
        self.text_transform = transform;
        self.text_align = align;
        self.font_weight = font_weight;
        self.font_size = font_size;
        self.letter_spacing = letter_spacing;
        self.overflow = overflow;
        self
    }
    
    pub fn with_layout(
        mut self,
        min_width: Option<f32>,
        max_width: Option<f32>,
        fixed_width: Option<f32>,
        fixed_height: Option<f32>,
        alignment: Option<Alignment>,
        edge_insets: Option<EdgeInsets>
    ) -> Self {
        self.min_width = min_width;
        self.max_width = max_width;
        self.fixed_width = fixed_width;
        self.fixed_height = fixed_height;
        self.alignment = alignment;
        self.edge_insets = edge_insets;
        self
    }
    
    pub fn with_loading(
        mut self,
        is_loading: bool,
        indicator_type: Option<LoadingIndicatorType>,
        indicator_color: Option<Color>,
        indicator_size: Option<f32>,
        hide_text: Option<bool>
    ) -> Self {
        self.is_loading = Some(is_loading);
        self.loading_indicator_type = indicator_type;
        self.loading_indicator_color = indicator_color;
        self.loading_indicator_size = indicator_size;
        self.hide_text_while_loading = hide_text;
        self
    }
    
    pub fn with_event_handlers(
        mut self,
        on_double_tap: Option<&str>,
        on_long_press: Option<&str>,
        on_hover_enter: Option<&str>,
        on_hover_exit: Option<&str>,
        on_focus: Option<&str>,
        on_blur: Option<&str>
    ) -> Self {
        self.on_double_tap = on_double_tap.map(|id| ButtonEventHandler {
            event_type: EventType::DoubleTap,
            handler_id: id.to_string(),
        });
        
        self.on_long_press = on_long_press.map(|id| ButtonEventHandler {
            event_type: EventType::LongPress,
            handler_id: id.to_string(),
        });
        
        self.on_hover_enter = on_hover_enter.map(|id| ButtonEventHandler {
            event_type: EventType::HoverEnter,
            handler_id: id.to_string(),
        });
        
        self.on_hover_exit = on_hover_exit.map(|id| ButtonEventHandler {
            event_type: EventType::HoverExit,
            handler_id: id.to_string(),
        });
        
        self.on_focus = on_focus.map(|id| ButtonEventHandler {
            event_type: EventType::Focus,
            handler_id: id.to_string(),
        });
        
        self.on_blur = on_blur.map(|id| ButtonEventHandler {
            event_type: EventType::Blur,
            handler_id: id.to_string(),
        });
        
        self
    }
    
    pub fn with_accessibility(
        mut self,
        label: Option<String>,
        hint: Option<String>,
        is_element: Option<bool>
    ) -> Self {
        self.accessibility_label = label;
        self.accessibility_hint = hint;
        self.is_accessibility_element = is_element;
        self
    }
    
    pub fn with_press_effect(
        mut self,
        enabled: bool,
        scale: Option<f32>,
        color_change: Option<Color>,
        offset: Option<(f32, f32)>,
        duration: Option<f32>
    ) -> Self {
        self.press_effect = Some(enabled);
        self.press_scale = scale;
        self.press_color_change = color_change;
        self.press_offset = offset;
        self.animation_duration = duration;
        self
    }
    
    pub fn convert_to_node_event_handler(&self, event_handler: &ButtonEventHandler) -> crate::render::node::EventHandler {
        crate::render::node::EventHandler {
            event_type: event_handler.event_type.clone(),
            handler_id: event_handler.handler_id.clone(),
        }
    }
}