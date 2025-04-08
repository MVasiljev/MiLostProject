use serde::{Serialize, Deserialize};

use super::{Color, EdgeInsets, UIComponent};

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq)]
pub enum HStackAlignment {
    Top,
    Center,
    Bottom,
    FirstTextBaseline,
    LastTextBaseline,
}

impl Default for HStackAlignment {
    fn default() -> Self {
        HStackAlignment::Center
    }
}

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq)]
pub enum VStackAlignment {
    Leading,
    Center,
    Trailing,
}

impl Default for VStackAlignment {
    fn default() -> Self {
        VStackAlignment::Leading
    }
}

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq)]
pub enum LayoutPriority {
    Low,
    Medium,
    High,
    Custom(f32),
}

impl Default for LayoutPriority {
    fn default() -> Self {
        LayoutPriority::Medium
    }
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Gradient {
    pub colors: Vec<Color>,
    pub positions: Vec<f32>,
    pub start_point: (f32, f32),
    pub end_point: (f32, f32),
    pub is_radial: bool,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct VStackProps {
    pub spacing: Option<f32>,
    pub padding: Option<f32>,
    pub background: Option<Color>,
    pub children: Vec<UIComponent>,
    
    pub alignment: Option<VStackAlignment>,
    pub edge_insets: Option<EdgeInsets>,
    
    pub min_width: Option<f32>,
    pub ideal_width: Option<f32>,
    pub max_width: Option<f32>,
    pub min_height: Option<f32>,
    pub ideal_height: Option<f32>,
    pub max_height: Option<f32>,
    
    pub clip_to_bounds: Option<bool>,
    pub layout_priority: Option<LayoutPriority>,
    pub equal_spacing: Option<bool>,
    
    pub shadow_radius: Option<f32>,
    pub shadow_color: Option<Color>,
    pub shadow_offset: Option<(f32, f32)>,
    
    pub gradient: Option<Gradient>,
    
    pub border_width: Option<f32>,
    pub border_color: Option<Color>,
    pub border_radius: Option<f32>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct HStackProps {
    pub spacing: Option<f32>,
    pub padding: Option<f32>,
    pub background: Option<Color>,
    pub children: Vec<UIComponent>,
    
    pub alignment: Option<HStackAlignment>,
    pub edge_insets: Option<EdgeInsets>,
    
    pub min_width: Option<f32>,
    pub ideal_width: Option<f32>,
    pub max_width: Option<f32>,
    pub min_height: Option<f32>,
    pub ideal_height: Option<f32>,
    pub max_height: Option<f32>,
    
    pub clip_to_bounds: Option<bool>,
    pub layout_priority: Option<LayoutPriority>,
    pub equal_spacing: Option<bool>,
    
    pub shadow_radius: Option<f32>,
    pub shadow_color: Option<Color>,
    pub shadow_offset: Option<(f32, f32)>,
    
    pub gradient: Option<Gradient>,
    
    pub border_width: Option<f32>,
    pub border_color: Option<Color>,
    pub border_radius: Option<f32>,
}

impl Default for VStackProps {
    fn default() -> Self {
        Self {
            spacing: None,
            padding: None,
            background: None,
            children: Vec::new(),
            alignment: None,
            edge_insets: None,
            min_width: None,
            ideal_width: None,
            max_width: None,
            min_height: None,
            ideal_height: None,
            max_height: None,
            clip_to_bounds: None,
            layout_priority: None,
            equal_spacing: None,
            shadow_radius: None,
            shadow_color: None,
            shadow_offset: None,
            gradient: None,
            border_width: None,
            border_color: None,
            border_radius: None,
        }
    }
}

impl Default for HStackProps {
    fn default() -> Self {
        Self {
            spacing: None,
            padding: None,
            background: None,
            children: Vec::new(),
            alignment: None,
            edge_insets: None,
            min_width: None,
            ideal_width: None,
            max_width: None,
            min_height: None,
            ideal_height: None,
            max_height: None,
            clip_to_bounds: None,
            layout_priority: None,
            equal_spacing: None,
            shadow_radius: None,
            shadow_color: None,
            shadow_offset: None,
            gradient: None,
            border_width: None,
            border_color: None,
            border_radius: None,
        }
    }
}

impl VStackProps {
    pub fn new() -> Self {
        Self::default()
    }

    pub fn spacing(mut self, spacing: f32) -> Self {
        self.spacing = Some(spacing);
        self
    }
    
    pub fn with_gradient(mut self, gradient: Gradient) -> Self {
        self.gradient = Some(gradient);
        self
    }
    
    pub fn with_shadow(mut self, radius: f32, color: Color, offset: Option<(f32, f32)>) -> Self {
        self.shadow_radius = Some(radius);
        self.shadow_color = Some(color);
        self.shadow_offset = offset;
        self
    }
    
    pub fn with_border(mut self, width: f32, color: Color, radius: Option<f32>) -> Self {
        self.border_width = Some(width);
        self.border_color = Some(color);
        self.border_radius = radius;
        self
    }
    
    pub(crate) fn add_children(mut self, items: Vec<UIComponent>) -> Self{
        self.children = items;
        self
    }
}

impl HStackProps {
    pub fn new() -> Self {
        Self::default()
    }

    pub fn spacing(mut self, spacing: f32) -> Self {
        self.spacing = Some(spacing);
        self
    }
    
    pub fn with_gradient(mut self, gradient: Gradient) -> Self {
        self.gradient = Some(gradient);
        self
    }
    
    pub fn with_shadow(mut self, radius: f32, color: Color, offset: Option<(f32, f32)>) -> Self {
        self.shadow_radius = Some(radius);
        self.shadow_color = Some(color);
        self.shadow_offset = offset;
        self
    }
    
    pub fn with_border(mut self, width: f32, color: Color, radius: Option<f32>) -> Self {
        self.border_width = Some(width);
        self.border_color = Some(color);
        self.border_radius = radius;
        self
    }

    pub(crate) fn add_children(mut self, items: Vec<UIComponent>) -> Self{
        self.children = items;
        self
    }
}