use serde::{Serialize, Deserialize};
use crate::{Color, UIComponent, EdgeInsets, Alignment};

// Split the alignments into separate enums to prevent misuse
#[derive(Debug, Serialize, Deserialize, Clone)]
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

#[derive(Debug, Serialize, Deserialize, Clone)]
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

#[derive(Debug, Serialize, Deserialize, Clone)]
pub enum LayoutPriority {
    Low,
    Medium,
    High,
    Custom(f32)
}

impl Default for LayoutPriority {
    fn default() -> Self {
        LayoutPriority::Medium
    }
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct VStackProps {
    // Original properties
    pub spacing: Option<f32>,
    pub padding: Option<f32>,
    pub background: Option<Color>,
    pub children: Vec<UIComponent>,
    
    // Enhanced properties - with VStack-specific alignment
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
        }
    }
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct HStackProps {
    // Original properties
    pub spacing: Option<f32>,
    pub padding: Option<f32>,
    pub background: Option<Color>,
    pub children: Vec<UIComponent>,
    
    // Enhanced properties - with HStack-specific alignment
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
        }
    }
}

// For both stacks, implement the builder pattern
impl VStackProps {
    pub fn new() -> Self {
        Self::default()
    }
    
    pub fn with_children(mut self, children: Vec<UIComponent>) -> Self {
        self.children = children;
        self
    }
    
    pub fn with_spacing(mut self, spacing: f32) -> Self {
        self.spacing = Some(spacing);
        self
    }
    
    pub fn with_padding(mut self, padding: f32) -> Self {
        self.padding = Some(padding);
        self
    }
    
    pub fn with_background(mut self, color: Color) -> Self {
        self.background = Some(color);
        self
    }
    
    pub fn with_alignment(mut self, alignment: VStackAlignment) -> Self {
        self.alignment = Some(alignment);
        self
    }
    
    pub fn with_edge_insets(mut self, insets: EdgeInsets) -> Self {
        self.edge_insets = Some(insets);
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
    
    pub fn with_layout_priority(mut self, priority: LayoutPriority) -> Self {
        self.layout_priority = Some(priority);
        self
    }
    
    pub fn with_equal_spacing(mut self, equal: bool) -> Self {
        self.equal_spacing = Some(equal);
        self
    }
}

impl HStackProps {
    pub fn new() -> Self {
        Self::default()
    }
    
    pub fn with_children(mut self, children: Vec<UIComponent>) -> Self {
        self.children = children;
        self
    }
    
    pub fn with_spacing(mut self, spacing: f32) -> Self {
        self.spacing = Some(spacing);
        self
    }
    
    pub fn with_padding(mut self, padding: f32) -> Self {
        self.padding = Some(padding);
        self
    }
    
    pub fn with_background(mut self, color: Color) -> Self {
        self.background = Some(color);
        self
    }
    
    pub fn with_alignment(mut self, alignment: HStackAlignment) -> Self {
        self.alignment = Some(alignment);
        self
    }
    
    pub fn with_edge_insets(mut self, insets: EdgeInsets) -> Self {
        self.edge_insets = Some(insets);
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
    
    pub fn with_layout_priority(mut self, priority: LayoutPriority) -> Self {
        self.layout_priority = Some(priority);
        self
    }
    
    pub fn with_equal_spacing(mut self, equal: bool) -> Self {
        self.equal_spacing = Some(equal);
        self
    }
}