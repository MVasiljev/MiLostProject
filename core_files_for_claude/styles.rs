use serde::{Serialize, Deserialize};
use std::collections::HashMap;

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq)]
pub struct GradientStop {
    pub color: String,
    pub position: f32,
    pub name: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq)]
pub enum GradientType {
    Linear,
    Radial,
    Conic,
    Repeating,
}

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq)]
pub struct Gradient {
    pub stops: Vec<GradientStop>,
    pub start_point: (f32, f32),
    pub end_point: (f32, f32),
    pub gradient_type: GradientType,
    
    pub angle: Option<f32>,
    pub spread_method: Option<SpreadMethod>,
    
    pub name: Option<String>,
    pub custom_props: Option<HashMap<String, String>>,
    
}

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq)]
pub enum SpreadMethod {
    Pad,
    Reflect,
    Repeat,
}

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq)]
pub struct ShadowEffect {
    pub color: String,
    pub offset: (f32, f32),
    pub blur_radius: f32,
    
    pub spread_radius: Option<f32>,
    pub inset: Option<bool>,
    pub opacity: Option<f32>,
    
    pub name: Option<String>,
    pub z_index: Option<i32>,
}

impl Gradient {
    pub fn linear(stops: Vec<GradientStop>, start: (f32, f32), end: (f32, f32)) -> Self {
        Self {
            stops,
            start_point: start,
            end_point: end,
            gradient_type: GradientType::Linear,
            angle: None,
            spread_method: None,
            name: None,
            custom_props: None,
        }
    }
    
    pub fn radial(stops: Vec<GradientStop>, center: (f32, f32), radius: f32) -> Self {
        Self {
            stops,
            start_point: center,
            end_point: (center.0 + radius, center.1 + radius),
            gradient_type: GradientType::Radial,
            angle: None,
            spread_method: None,
            name: None,
            custom_props: None,
        }
    }
    
    pub fn with_custom_prop(mut self, key: &str, value: &str) -> Self {
        let mut props = self.custom_props.take().unwrap_or_default();
        props.insert(key.to_string(), value.to_string());
        self.custom_props = Some(props);
        self
    }
    
    pub fn with_name(mut self, name: &str) -> Self {
        self.name = Some(name.to_string());
        self
    }
}

impl ShadowEffect {
    pub fn new(color: &str, offset: (f32, f32), blur_radius: f32) -> Self {
        Self {
            color: color.to_string(),
            offset,
            blur_radius,
            spread_radius: None,
            inset: None,
            opacity: None,
            name: None,
            z_index: None,
        }
    }
    
    pub fn with_spread(mut self, spread_radius: f32) -> Self {
        self.spread_radius = Some(spread_radius);
        self
    }
    
    pub fn inset(mut self) -> Self {
        self.inset = Some(true);
        self
    }
    
    pub fn with_opacity(mut self, opacity: f32) -> Self {
        self.opacity = Some(opacity.max(0.0).min(1.0));
        self
    }
    
    pub fn with_name(mut self, name: &str) -> Self {
        self.name = Some(name.to_string());
        self
    }
    
    pub fn with_z_index(mut self, z_index: i32) -> Self {
        self.z_index = Some(z_index);
        self
    }
}

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq)]
pub enum BorderStyle {
    Solid,
    Dashed,
    Dotted,
    None,
}

impl Default for BorderStyle {
    fn default() -> Self {
        BorderStyle::Solid
    }
}

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq)]
pub enum TextTransform {
    None,
    Uppercase,
    Lowercase,
    Capitalize,
}

impl Default for TextTransform {
    fn default() -> Self {
        TextTransform::None
    }
}

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq)]
pub enum TextAlign {
    Left,
    Center,
    Right,
}

impl Default for TextAlign {
    fn default() -> Self {
        TextAlign::Center
    }
}

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq)]
pub enum Overflow {
    Visible,
    Hidden,
    Scroll,
    Ellipsis,
}

impl Default for Overflow {
    fn default() -> Self {
        Overflow::Visible
    }
}

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq)]
pub enum LoadingIndicatorType {
    Spinner,
    DotPulse,
    BarPulse,
    Custom,
}

impl Default for LoadingIndicatorType {
    fn default() -> Self {
        LoadingIndicatorType::Spinner
    }
}