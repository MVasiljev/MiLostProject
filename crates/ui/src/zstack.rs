use serde::{Serialize, Deserialize};
use crate::{UIComponent, Color, EdgeInsets, Alignment};

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
    // Original properties
    pub alignment: Option<ZStackAlignment>,
    pub children: Vec<UIComponent>,
    
    // Enhanced properties
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
        }
    }
}

// Implement builder pattern for ZStack
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
}