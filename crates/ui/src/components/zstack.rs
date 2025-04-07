use serde::{Serialize, Deserialize};
use crate::{UIComponent, Color, EdgeInsets, Alignment};
use crate::shared::styles::{Gradient, ShadowEffect, BorderStyle};

#[derive(Debug, Clone, Copy, Serialize, Deserialize, PartialEq)]
pub enum ZStackAlignment {
    Center,
    TopLeading,
    Top,
    TopTrailing,
    Leading,
    Trailing,
    BottomLeading,
    Bottom,
    BottomTrailing,
}

impl Default for ZStackAlignment {
    fn default() -> Self {
        ZStackAlignment::Center
    }
}

impl From<ZStackAlignment> for Alignment {
    fn from(alignment: ZStackAlignment) -> Self {
        match alignment {
            ZStackAlignment::Center => Alignment::Center,
            ZStackAlignment::TopLeading => Alignment::TopLeading,
            ZStackAlignment::Top => Alignment::Top,
            ZStackAlignment::TopTrailing => Alignment::TopTrailing,
            ZStackAlignment::Leading => Alignment::Leading,
            ZStackAlignment::Trailing => Alignment::Trailing,
            ZStackAlignment::BottomLeading => Alignment::BottomLeading,
            ZStackAlignment::Bottom => Alignment::Bottom,
            ZStackAlignment::BottomTrailing => Alignment::BottomTrailing,
        }
    }
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ZStackProps {
    pub alignment: Option<ZStackAlignment>,
    pub children: Vec<UIComponent>,
    
    pub edge_insets: Option<EdgeInsets>,
    pub background: Option<Color>,
    pub min_width: Option<f32>,
    pub ideal_width: Option<f32>,
    pub max_width: Option<f32>,
    pub min_height: Option<f32>,
    pub ideal_height: Option<f32>,
    pub max_height: Option<f32>,
    pub clip_to_bounds: Option<bool>,
    pub layout_priority: Option<f32>,
    
    pub shadow_radius: Option<f32>,
    pub shadow_color: Option<Color>,
    pub shadow_offset: Option<(f32, f32)>,
    
    pub gradient: Option<Gradient>,
    
    pub border_width: Option<f32>,
    pub border_color: Option<Color>,
    pub border_radius: Option<f32>,
    pub border_style: Option<BorderStyle>,
    
    pub opacity: Option<f32>,
    pub accessibility_label: Option<String>,
    pub accessibility_hint: Option<String>,
    pub is_accessibility_element: Option<bool>,
}

impl Default for ZStackProps {
    fn default() -> Self {
        Self {
            alignment: None,
            children: Vec::new(),
            edge_insets: None,
            background: None,
            min_width: None,
            ideal_width: None,
            max_width: None,
            min_height: None,
            ideal_height: None,
            max_height: None,
            clip_to_bounds: None,
            layout_priority: None,
            shadow_radius: None,
            shadow_color: None,
            shadow_offset: None,
            gradient: None,
            border_width: None,
            border_color: None,
            border_radius: None,
            border_style: None,
            opacity: None,
            accessibility_label: None,
            accessibility_hint: None,
            is_accessibility_element: None,
        }
    }
}

impl ZStackProps {
    pub fn new() -> Self {
        Self::default()
    }
    
    pub fn with_children(mut self, children: Vec<UIComponent>) -> Self {
        self.children = children;
        self
    }
    
    pub fn with_alignment(mut self, alignment: ZStackAlignment) -> Self {
        self.alignment = Some(alignment);
        self
    }
    
    pub fn with_edge_insets(mut self, insets: EdgeInsets) -> Self {
        self.edge_insets = Some(insets);
        self
    }
    
    pub fn with_background(mut self, color: Color) -> Self {
        self.background = Some(color);
        self
    }
    
    pub fn with_min_width(mut self, width: f32) -> Self {
        self.min_width = Some(width);
        self
    }
    
    pub fn with_ideal_width(mut self, width: f32) -> Self {
        self.ideal_width = Some(width);
        self
    }
    
    pub fn with_max_width(mut self, width: f32) -> Self {
        self.max_width = Some(width);
        self
    }
    
    pub fn with_min_height(mut self, height: f32) -> Self {
        self.min_height = Some(height);
        self
    }
    
    pub fn with_ideal_height(mut self, height: f32) -> Self {
        self.ideal_height = Some(height);
        self
    }
    
    pub fn with_max_height(mut self, height: f32) -> Self {
        self.max_height = Some(height);
        self
    }
    
    pub fn with_clip_to_bounds(mut self, clip: bool) -> Self {
        self.clip_to_bounds = Some(clip);
        self
    }
    
    pub fn with_layout_priority(mut self, priority: f32) -> Self {
        self.layout_priority = Some(priority);
        self
    }
    
    pub fn with_shadow(mut self, radius: f32, color: Color, offset: Option<(f32, f32)>) -> Self {
        self.shadow_radius = Some(radius);
        self.shadow_color = Some(color);
        self.shadow_offset = offset;
        self
    }
    
    pub fn with_gradient(mut self, gradient: Gradient) -> Self {
        self.gradient = Some(gradient);
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