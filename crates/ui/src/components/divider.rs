use serde::{Serialize, Deserialize};
use crate::Color;
use crate::font::{FontDescriptor, TextStyle};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub enum DividerStyle {
    Solid,
    Dashed,
    Dotted,
    Gradient,
    Inset,
    Outset,
}

impl Default for DividerStyle {
    fn default() -> Self {
        DividerStyle::Solid
    }
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct DividerProps {
    pub thickness: Option<f32>,
    pub color: Option<Color>,
    pub style: Option<DividerStyle>,
    pub padding: Option<f32>,

    pub dash_length: Option<f32>,
    pub gap_length: Option<f32>,
    pub dot_radius: Option<f32>,
    pub dot_spacing: Option<f32>,

    pub gradient_colors: Option<Vec<Color>>,
    pub gradient_direction: Option<String>,

    pub label: Option<String>,
    pub label_color: Option<Color>,
    pub label_font: Option<FontDescriptor>,
    pub label_position: Option<LabelPosition>,
    pub label_padding: Option<f32>,
    pub label_background: Option<Color>,

    pub semantic_label: Option<String>,
    pub accessibility_hint: Option<String>,

    pub opacity: Option<f32>,
    pub border_radius: Option<f32>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub enum LabelPosition {
    Left,
    Center,
    Right,
    Overlay,
}

impl Default for DividerProps {
    fn default() -> Self {
        Self {
            thickness: Some(1.0),
            color: Some(Color::Gray),
            style: Some(DividerStyle::Solid),
            padding: Some(0.0),
            
            dash_length: Some(5.0),
            gap_length: Some(3.0),
            dot_radius: None,
            dot_spacing: None,
            
            gradient_colors: None,
            gradient_direction: None,
            
            label: None,
            label_color: None,
            label_font: None,
            label_position: Some(LabelPosition::Center),
            label_padding: Some(8.0),
            label_background: None,
            
            semantic_label: None,
            accessibility_hint: None,
            
            opacity: Some(1.0),
            border_radius: None,
        }
    }
}

pub mod divider_color_schemes {
    use super::*;
    
    pub fn light() -> DividerProps {
        DividerProps {
            color: Some(Color::LightGray),
            ..Default::default()
        }
    }
    
    pub fn dark() -> DividerProps {
        DividerProps {
            color: Some(Color::DarkGray),
            opacity: Some(0.7),
            ..Default::default()
        }
    }
    
    pub fn accent() -> DividerProps {
        DividerProps {
            color: Some(Color::Accent),
            thickness: Some(2.0),
            ..Default::default()
        }
    }
    
    pub fn gradient() -> DividerProps {
        DividerProps {
            style: Some(DividerStyle::Gradient),
            gradient_colors: Some(vec![
                Color::Primary, 
                Color::Secondary
            ]),
            gradient_direction: Some("horizontal".to_string()),
            thickness: Some(2.0),
            ..Default::default()
        }
    }
}