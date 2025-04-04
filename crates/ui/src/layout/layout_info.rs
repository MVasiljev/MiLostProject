use std::collections::HashMap;
use super::types::{Alignment, Rect, Size};

#[derive(Debug, Clone)]
pub struct LayoutInfo {
    pub frame: Rect,
    pub padding: Option<f32>,
    pub alignment: Option<Alignment>,
    pub content_size: Size,
    pub flex_grow: Option<f32>,
    pub flex_shrink: Option<f32>,
    pub flex_basis: Option<f32>,
    pub min_width: Option<f32>,
    pub max_width: Option<f32>,
    pub min_height: Option<f32>,
    pub max_height: Option<f32>,
    pub parent_type: Option<String>,
    pub resolved_props: HashMap<String, String>,
}

impl LayoutInfo {
    pub fn new() -> Self {
        Self {
            frame: Rect::zero(),
            padding: None,
            alignment: None,
            content_size: Size::zero(),
            flex_grow: None,
            flex_shrink: None,
            flex_basis: None,
            min_width: None,
            max_width: None,
            min_height: None,
            max_height: None,
            parent_type: None,
            resolved_props: HashMap::new(),
        }
    }
    
    pub fn with_frame(mut self, frame: Rect) -> Self {
        self.frame = frame;
        self
    }
    
    pub fn with_padding(mut self, padding: f32) -> Self {
        self.padding = Some(padding);
        self
    }
    
    pub fn with_alignment(mut self, alignment: Alignment) -> Self {
        self.alignment = Some(alignment);
        self
    }
    
    pub fn with_content_size(mut self, size: Size) -> Self {
        self.content_size = size;
        self
    }
    
    pub fn with_flex_grow(mut self, flex_grow: f32) -> Self {
        self.flex_grow = Some(flex_grow);
        self
    }
    
    pub fn with_flex_shrink(mut self, flex_shrink: f32) -> Self {
        self.flex_shrink = Some(flex_shrink);
        self
    }
    
    pub fn with_flex_basis(mut self, flex_basis: f32) -> Self {
        self.flex_basis = Some(flex_basis);
        self
    }
    
    pub fn with_min_width(mut self, min_width: f32) -> Self {
        self.min_width = Some(min_width);
        self
    }
    
    pub fn with_max_width(mut self, max_width: f32) -> Self {
        self.max_width = Some(max_width);
        self
    }
    
    pub fn with_min_height(mut self, min_height: f32) -> Self {
        self.min_height = Some(min_height);
        self
    }
    
    pub fn with_max_height(mut self, max_height: f32) -> Self {
        self.max_height = Some(max_height);
        self
    }
    
    pub fn with_parent_type(mut self, parent_type: &str) -> Self {
        self.parent_type = Some(parent_type.to_string());
        self
    }
    
    pub fn inner_rect(&self) -> Rect {
        if let Some(padding) = self.padding {
            self.frame.inset(padding)
        } else {
            self.frame
        }
    }
    
    pub fn constrain_size(&self, size: Size) -> Size {
        let width = if let Some(max_width) = self.max_width {
            size.width.min(max_width)
        } else {
            size.width
        };
        
        let width = if let Some(min_width) = self.min_width {
            width.max(min_width)
        } else {
            width
        };
        
        let height = if let Some(max_height) = self.max_height {
            size.height.min(max_height)
        } else {
            size.height
        };
        
        let height = if let Some(min_height) = self.min_height {
            height.max(min_height)
        } else {
            height
        };
        
        Size::new(width, height)
    }
}