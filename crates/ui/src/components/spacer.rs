use serde::{Serialize, Deserialize};
use crate::shared::styles::BorderStyle;
use crate::shared::edge_insets::EdgeInsets;

use super::{Color, UIComponent};

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum SpacerStrategy {
    Fixed(f32),
    Flexible(f32),
    Minimum(f32),
    Maximum(f32),
}

impl Default for SpacerStrategy {
    fn default() -> Self {
        SpacerStrategy::Flexible(1.0)
    }
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct SpacerProps {
    pub strategy: Option<SpacerStrategy>,
    pub children: Vec<UIComponent>,
    
    pub background: Option<Color>,
    pub opacity: Option<f32>,
    
    pub border_width: Option<f32>,
    pub border_color: Option<Color>,
    pub border_radius: Option<f32>,
    pub border_style: Option<BorderStyle>,
    
    pub edge_insets: Option<EdgeInsets>,
    
    pub accessibility_label: Option<String>,
    pub accessibility_hint: Option<String>,
    pub is_accessibility_element: Option<bool>,
}

impl Default for SpacerProps {
    fn default() -> Self {
        Self {
            strategy: Some(SpacerStrategy::default()),
            children: Vec::new(),
            background: None,
            opacity: None,
            border_width: None,
            border_color: None,
            border_radius: None,
            border_style: None,
            edge_insets: None,
            accessibility_label: None,
            accessibility_hint: None,
            is_accessibility_element: None,
        }
    }
}

impl SpacerProps {
    pub fn new() -> Self {
        Self::default()
    }
    
    pub fn fixed(size: f32) -> Self {
        Self {
            strategy: Some(SpacerStrategy::Fixed(size)),
            ..Default::default()
        }
    }
    
    pub fn flexible(grow: f32) -> Self {
        Self {
            strategy: Some(SpacerStrategy::Flexible(grow)),
            ..Default::default()
        }
    }
    
    pub fn min(size: f32) -> Self {
        Self {
            strategy: Some(SpacerStrategy::Minimum(size)),
            ..Default::default()
        }
    }
    
    pub fn max(size: f32) -> Self {
        Self {
            strategy: Some(SpacerStrategy::Maximum(size)),
            ..Default::default()
        }
    }
    
    pub fn with_background(mut self, color: Color) -> Self {
        self.background = Some(color);
        self
    }
    
    pub fn with_border(mut self, width: f32, color: Color, radius: Option<f32>, style: Option<BorderStyle>) -> Self {
        self.border_width = Some(width);
        self.border_color = Some(color);
        self.border_radius = radius;
        self.border_style = style;
        self
    }
    
    pub fn with_opacity(mut self, opacity: f32) -> Self {
        self.opacity = Some(opacity);
        self
    }
    
    pub fn with_accessibility(mut self, label: Option<String>, hint: Option<String>, is_element: Option<bool>) -> Self {
        self.accessibility_label = label;
        self.accessibility_hint = hint;
        self.is_accessibility_element = is_element;
        self
    }
}