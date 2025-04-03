
use crate::render::node::RenderNode;
use super::types::{Rect, Size, Alignment};
use std::collections::HashMap;

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


pub struct LayoutEngine {
    layout_cache: HashMap<String, LayoutInfo>,
}

impl LayoutEngine {
    pub fn new() -> Self {
        Self {
            layout_cache: HashMap::new(),
        }
    }
    
    pub fn compute_layout<'a>(&mut self, node: &'a mut RenderNode, container_size: Size) -> &'a mut RenderNode {
        self.layout_cache.clear();
        
        self.measure_node(node, container_size);
        
        self.position_node(node, Rect::from_size(container_size.width, container_size.height));
        
        self.apply_layout(node);
        
        node
    }

    fn position_vstack_children_flex(&mut self, node: &RenderNode, frame: Rect) -> () {
        let spacing = node.resolved_props.get("spacing")
            .and_then(|val| val.parse::<f32>().ok())
            .unwrap_or(0.0);
        
        let mut total_fixed_height = 0.0;
        let mut total_flex_grow = 0.0;
        let mut flex_items = Vec::new();
        
        for (i, child) in node.children.iter().enumerate() {
            if let Some(mut child_layout) = self.layout_cache.get_mut(&child.id) {
                child_layout.parent_type = Some("VStack".to_string());
            }
            
            let flex_grow = child.resolved_props.get("flex_grow")
                .and_then(|val| val.parse::<f32>().ok())
                .unwrap_or(0.0);
            
            if flex_grow > 0.0 {
                total_flex_grow += flex_grow;
                flex_items.push((i, flex_grow));
            } else if let Some(child_layout) = self.layout_cache.get(&child.id) {
                total_fixed_height += child_layout.content_size.height;
            }
        }
        
        let spacing_height = if node.children.len() > 1 {
            spacing * (node.children.len() - 1) as f32
        } else {
            0.0
        };
        
        total_fixed_height += spacing_height;
        
        let available_flex_height = (frame.height - total_fixed_height).max(0.0);
        
        let mut y_offset = frame.y;
        
        for (i, child) in node.children.iter().enumerate() {
            if let Some(child_layout) = self.layout_cache.get(&child.id) {
                let mut child_height = child_layout.content_size.height;
                
                if let Some((_, flex_grow)) = flex_items.iter().find(|(idx, _)| *idx == i) {
                    if total_flex_grow > 0.0 {
                        child_height = (available_flex_height * flex_grow / total_flex_grow).max(0.0);
                    }
                }
                
                if let Some(max_height) = child_layout.max_height {
                    child_height = child_height.min(max_height);
                }
                
                if let Some(min_height) = child_layout.min_height {
                    child_height = child_height.max(min_height);
                }
                
                let child_frame = Rect::new(
                    frame.x,
                    y_offset,
                    frame.width,
                    child_height
                );
                
                self.position_node(child, child_frame);
                
                y_offset += child_height + spacing;
            }
        }
    }
    
    fn position_hstack_children_flex(&mut self, node: &RenderNode, frame: Rect) -> () {
        let spacing = node.resolved_props.get("spacing")
            .and_then(|val| val.parse::<f32>().ok())
            .unwrap_or(0.0);
        
        let mut total_fixed_width = 0.0;
        let mut total_flex_grow = 0.0;
        let mut flex_items = Vec::new();
        
        for (i, child) in node.children.iter().enumerate() {
            if let Some(mut child_layout) = self.layout_cache.get_mut(&child.id) {
                child_layout.parent_type = Some("HStack".to_string());
            }
            
            let flex_grow = child.resolved_props.get("flex_grow")
                .and_then(|val| val.parse::<f32>().ok())
                .unwrap_or(0.0);
            
            if flex_grow > 0.0 {
                total_flex_grow += flex_grow;
                flex_items.push((i, flex_grow));
            } else if let Some(child_layout) = self.layout_cache.get(&child.id) {
                total_fixed_width += child_layout.content_size.width;
            }
        }
        
        let spacing_width = if node.children.len() > 1 {
            spacing * (node.children.len() - 1) as f32
        } else {
            0.0
        };
        
        total_fixed_width += spacing_width;
        
        let available_flex_width = (frame.width - total_fixed_width).max(0.0);
        
        let mut x_offset = frame.x;
        
        for (i, child) in node.children.iter().enumerate() {
            if let Some(child_layout) = self.layout_cache.get(&child.id) {
                let mut child_width = child_layout.content_size.width;
                
                if let Some((_, flex_grow)) = flex_items.iter().find(|(idx, _)| *idx == i) {
                    if total_flex_grow > 0.0 {
                        child_width = (available_flex_width * flex_grow / total_flex_grow).max(0.0);
                    }
                }
                
                if let Some(max_width) = child_layout.max_width {
                    child_width = child_width.min(max_width);
                }
                
                if let Some(min_width) = child_layout.min_width {
                    child_width = child_width.max(min_width);
                }
                
                let child_frame = Rect::new(
                    x_offset,
                    frame.y,
                    child_width,
                    frame.height
                );
                
                self.position_node(child, child_frame);
                
                x_offset += child_width + spacing;
            }
        }
    }
    
    fn enhanced_measure_node(&mut self, node: &RenderNode, available_size: Size) -> Size {
        let node_type = &node.type_name;
        
        let content_size = match node_type.as_str() {
            "VStack" => self.measure_vstack(node, available_size),
            "HStack" => self.measure_hstack(node, available_size),
            "ZStack" => self.measure_zstack(node, available_size),
            "Text" => self.measure_text(node, available_size),
            "Button" => self.measure_button(node, available_size),
            "Image" => self.measure_image(node, available_size),
            "Scroll" => self.measure_scroll(node, available_size),
            "Spacer" => self.measure_spacer(node, available_size),
            "Divider" => self.measure_divider(node, available_size),
            _ => Size::zero(),
        };
        
        let mut layout_info = LayoutInfo::new().with_content_size(content_size);
        
        if let Some(padding) = node.resolved_props.get("padding") {
            if let Ok(padding_value) = padding.parse::<f32>() {
                layout_info = layout_info.with_padding(padding_value);
            }
        }
        
        if let Some(alignment_str) = node.resolved_props.get("alignment") {
            let alignment = match alignment_str.as_str() {
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
            
            if let Some(a) = alignment {
                layout_info = layout_info.with_alignment(a);
            }
        }
        
        if let Some(flex_grow) = node.resolved_props.get("flex_grow") {
            if let Ok(value) = flex_grow.parse::<f32>() {
                layout_info = layout_info.with_flex_grow(value);
            }
        }
        
        if let Some(flex_shrink) = node.resolved_props.get("flex_shrink") {
            if let Ok(value) = flex_shrink.parse::<f32>() {
                layout_info = layout_info.with_flex_shrink(value);
            }
        }
        
        if let Some(flex_basis) = node.resolved_props.get("flex_basis") {
            if let Ok(value) = flex_basis.parse::<f32>() {
                layout_info = layout_info.with_flex_basis(value);
            }
        }
        
        if let Some(min_width) = node.resolved_props.get("min_width") {
            if let Ok(value) = min_width.parse::<f32>() {
                layout_info = layout_info.with_min_width(value);
            }
        }
        
        if let Some(max_width) = node.resolved_props.get("max_width") {
            if let Ok(value) = max_width.parse::<f32>() {
                layout_info = layout_info.with_max_width(value);
            }
        }
        
        if let Some(min_height) = node.resolved_props.get("min_height") {
            if let Ok(value) = min_height.parse::<f32>() {
                layout_info = layout_info.with_min_height(value);
            }
        }
        
        if let Some(max_height) = node.resolved_props.get("max_height") {
            if let Ok(value) = max_height.parse::<f32>() {
                layout_info = layout_info.with_max_height(value);
            }
        }
        
        self.layout_cache.insert(node.id.clone(), layout_info);
        
        content_size
    }
    
    fn measure_node(&mut self, node: &RenderNode, available_size: Size) -> Size {
        let node_type = &node.type_name;
        
        let content_size = match node_type.as_str() {
            "VStack" => self.measure_vstack(node, available_size),
            "HStack" => self.measure_hstack(node, available_size),
            "ZStack" => self.measure_zstack(node, available_size),
            "Text" => self.measure_text(node, available_size),
            "Button" => self.measure_button(node, available_size),
            "Image" => self.measure_image(node, available_size),
            "Scroll" => self.measure_scroll(node, available_size),
            "Spacer" => self.measure_spacer(node, available_size),
            "Divider" => self.measure_divider(node, available_size),
            _ => Size::zero(),
        };
        
        let mut layout_info = LayoutInfo::new().with_content_size(content_size);
        
        if let Some(padding) = node.resolved_props.get("padding") {
            if let Ok(padding_value) = padding.parse::<f32>() {
                layout_info = layout_info.with_padding(padding_value);
            }
        }
        
        if let Some(alignment_str) = node.resolved_props.get("alignment") {
            let alignment = match alignment_str.as_str() {
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
            
            if let Some(a) = alignment {
                layout_info = layout_info.with_alignment(a);
            }
        }
        
        self.layout_cache.insert(node.id.clone(), layout_info);
        
        content_size
    }
    
    fn position_node(&mut self, node: &RenderNode, frame: Rect) -> () {
        if let Some(mut layout_info) = self.layout_cache.get_mut(&node.id) {
            layout_info.frame = frame;
            
            let inner_frame = if let Some(padding) = layout_info.padding {
                frame.inset(padding)
            } else {
                frame
            };
            
            match node.type_name.as_str() {
                "VStack" => self.position_vstack_children(node, inner_frame),
                "HStack" => self.position_hstack_children(node, inner_frame),
                "ZStack" => self.position_zstack_children(node, inner_frame),
                "Scroll" => self.position_scroll_children(node, inner_frame),
                _ => (),
            }
        }
    }
    
    fn apply_layout(&self, node: &mut RenderNode) {
        if let Some(layout) = self.layout_cache.get(&node.id) {
            node.resolved_props.insert("x".to_string(), layout.frame.x.to_string());
            node.resolved_props.insert("y".to_string(), layout.frame.y.to_string());
            node.resolved_props.insert("width".to_string(), layout.frame.width.to_string());
            node.resolved_props.insert("height".to_string(), layout.frame.height.to_string());
            
            for child in &mut node.children {
                self.apply_layout(child);
            }
        }
    }
    
    
    fn measure_vstack(&mut self, node: &RenderNode, available_size: Size) -> Size {
        let spacing = node.resolved_props.get("spacing")
            .and_then(|val| val.parse::<f32>().ok())
            .unwrap_or(0.0);
        
        let mut total_height = 0.0;
        let mut max_width: f32 = 0.0;
        
        for (i, child) in node.children.iter().enumerate() {
            let child_size = self.measure_node(child, available_size);
            
            total_height += child_size.height;
            
            if i < node.children.len() - 1 {
                total_height += spacing;
            }
            
            max_width = max_width.max(child_size.width);
        }
        
        Size::new(max_width, total_height)
    }
    
    fn measure_hstack(&mut self, node: &RenderNode, available_size: Size) -> Size {
        let spacing = node.resolved_props.get("spacing")
            .and_then(|val| val.parse::<f32>().ok())
            .unwrap_or(0.0);
        
        let mut total_width: f32 = 0.0;
        let mut max_height: f32 = 0.0;
        
        for (i, child) in node.children.iter().enumerate() {
            let child_size = self.measure_node(child, available_size);
            
            total_width += child_size.width;
            
            if i < node.children.len() - 1 {
                total_width += spacing;
            }
            
            max_height = max_height.max(child_size.height);
        }
        
        Size::new(total_width, max_height)
    }
    
    fn measure_zstack(&mut self, node: &RenderNode, available_size: Size) -> Size {
        let mut max_width: f32 = 0.0;
        let mut max_height: f32 = 0.0;
        
        for child in &node.children {
            let child_size = self.measure_node(child, available_size);
            max_width = max_width.max(child_size.width);
            max_height = max_height.max(child_size.height);
        }
        
        Size::new(max_width, max_height)
    }
    
    fn measure_text(&mut self, node: &RenderNode, available_size: Size) -> Size {
        let content = node.resolved_props.get("content")
            .cloned()
            .unwrap_or_else(|| "".to_string());
        
        let font_style = node.resolved_props.get("font_style")
            .cloned()
            .unwrap_or_else(|| "Body".to_string());
        
        let text_height = match font_style.as_str() {
            "Title" | "FontStyle::Title" => 32.0,
            "Body" | "FontStyle::Body" => 18.0,
            "Caption" | "FontStyle::Caption" => 14.0,
            _ => 18.0,
        };
        
        let char_width = match font_style.as_str() {
            "Title" | "FontStyle::Title" => 18.0,
            "Body" | "FontStyle::Body" => 10.0,
            "Caption" | "FontStyle::Caption" => 8.0,
            _ => 10.0,
        };
        
        let text_width = (content.len() as f32 * char_width).min(available_size.width);
        
        Size::new(text_width, text_height)
    }
    
    fn measure_button(&mut self, node: &RenderNode, available_size: Size) -> Size {
        let label = node.resolved_props.get("label")
            .cloned()
            .unwrap_or_else(|| "".to_string());
        
        let button_height = 36.0;
        let button_width = ((label.len() as f32 * 10.0) + 20.0).min(available_size.width);
        
        Size::new(button_width, button_height)
    }
    
    fn measure_image(&mut self, node: &RenderNode, available_size: Size) -> Size {
        Size::new(available_size.width, 200.0)
    }
    
    fn measure_scroll(&mut self, node: &RenderNode, available_size: Size) -> Size {
        if node.children.is_empty() {
            return Size::new(available_size.width, available_size.height);
        }
        
        let content_size = self.measure_node(&node.children[0], available_size);
        
        Size::new(available_size.width, available_size.height)
    }
    
    fn measure_spacer(&mut self, node: &RenderNode, available_size: Size) -> Size {
        let size = node.resolved_props.get("size")
            .and_then(|val| val.parse::<f32>().ok());
        
        let min_size = node.resolved_props.get("min_size")
            .and_then(|val| val.parse::<f32>().ok())
            .unwrap_or(0.0);
        
        let max_size = node.resolved_props.get("max_size")
            .and_then(|val| val.parse::<f32>().ok())
            .unwrap_or(f32::MAX);
        
        // If in a VStack, the spacer takes width from container but custom height
        // If in a HStack, the spacer takes height from container but custom width
        // We need to determine the container type to apply spacing correctly
        let parent_type = node.resolved_props.get("_parent_type")
            .cloned()
            .unwrap_or_else(|| "Unknown".to_string());
        
        match parent_type.as_str() {
            "VStack" => {
                let height = if let Some(s) = size {
                    s.max(min_size).min(max_size)
                } else {
                    min_size
                };
                Size::new(available_size.width, height)
            },
            "HStack" => {
                let width = if let Some(s) = size {
                    s.max(min_size).min(max_size)
                } else {
                    min_size
                };
                Size::new(width, available_size.height)
            },
            _ => {
                // If parent type is unknown or not a stack, use square dimensions
                let dimension = size.unwrap_or(0.0).max(min_size).min(max_size);
                Size::new(dimension, dimension)
            }
        }
    }
    
    fn measure_divider(&mut self, node: &RenderNode, available_size: Size) -> Size {
        let thickness = node.resolved_props.get("thickness")
            .and_then(|val| val.parse::<f32>().ok())
            .unwrap_or(1.0);
        
        let padding = node.resolved_props.get("padding")
            .and_then(|val| val.parse::<f32>().ok())
            .unwrap_or(0.0);
        
        // Add padding to the divider's height
        let total_height = thickness + (padding * 2.0);
        
        Size::new(available_size.width, total_height)
    }
    
    
    fn position_vstack_children(&mut self, node: &RenderNode, frame: Rect) -> () {
        let spacing = node.resolved_props.get("spacing")
            .and_then(|val| val.parse::<f32>().ok())
            .unwrap_or(0.0);
        
        // First pass: Calculate total fixed height and count flex items
        let mut total_fixed_height = 0.0;
        let mut total_flex_grow = 0.0;
        let mut flex_items = Vec::new();
        
        for (i, child) in node.children.iter().enumerate() {
            // Mark each child with its parent type for proper sizing
            if let Some(mut child_layout) = self.layout_cache.get_mut(&child.id) {
                child_layout.resolved_props.insert("_parent_type".to_string(), "VStack".to_string());
            }
            
            let is_spacer = child.type_name == "Spacer";
            let flex_grow = if is_spacer {
                child.resolved_props.get("flex_grow")
                    .and_then(|val| val.parse::<f32>().ok())
                    .unwrap_or(if child.resolved_props.get("size").is_none() { 1.0 } else { 0.0 })
            } else {
                0.0
            };
            
            if flex_grow > 0.0 {
                total_flex_grow += flex_grow;
                flex_items.push((i, flex_grow));
            } else if let Some(child_layout) = self.layout_cache.get(&child.id) {
                total_fixed_height += child_layout.content_size.height;
            }
        }
        
        // Add spacing between items
        if node.children.len() > 1 {
            total_fixed_height += spacing * (node.children.len() - 1) as f32;
        }
        
        // Calculate remaining space for flex items
        let available_flex_height = (frame.height - total_fixed_height).max(0.0);
        
        // Second pass: Position all children with flex distribution
        let mut y_offset = frame.y;
        
        for (i, child) in node.children.iter().enumerate() {
            if let Some(child_layout) = self.layout_cache.get(&child.id) {
                let mut child_height = child_layout.content_size.height;
                
                // Apply flex growth if this is a flex item
                if let Some((_, flex_grow)) = flex_items.iter().find(|(idx, _)| *idx == i) {
                    if total_flex_grow > 0.0 {
                        child_height = (available_flex_height * flex_grow / total_flex_grow).max(0.0);
                    }
                }
                
                let child_frame = Rect::new(
                    frame.x,
                    y_offset,
                    frame.width,
                    child_height
                );
                
                self.position_node(child, child_frame);
                
                y_offset += child_height + spacing;
            }
        }
    }
    
    fn position_hstack_children(&mut self, node: &RenderNode, frame: Rect) -> () {
        let spacing = node.resolved_props.get("spacing")
            .and_then(|val| val.parse::<f32>().ok())
            .unwrap_or(0.0);
        
        let mut x_offset = frame.x;
        
        for child in &node.children {
            if let Some(child_layout) = self.layout_cache.get(&child.id) {
                let child_size = child_layout.content_size;
                
                let child_frame = Rect::new(
                    x_offset,
                    frame.y,
                    child_size.width,
                    frame.height
                );
                
                self.position_node(child, child_frame);
                
                x_offset += child_size.width + spacing;
            }
        }
    }
    
    fn position_zstack_children(&mut self, node: &RenderNode, frame: Rect) -> () {
        for child in &node.children {
            if let Some(child_layout) = self.layout_cache.get(&child.id) {
                let child_size = child_layout.content_size;
                
                let alignment = if let Some(info) = self.layout_cache.get(&node.id) {
                    info.alignment.unwrap_or(Alignment::Center)
                } else {
                    Alignment::Center
                };
                
                let (x, y) = match alignment {
                    Alignment::TopLeading => (frame.x, frame.y),
                    Alignment::Top => (frame.x + (frame.width - child_size.width) / 2.0, frame.y),
                    Alignment::TopTrailing => (frame.right() - child_size.width, frame.y),
                    Alignment::Leading => (frame.x, frame.y + (frame.height - child_size.height) / 2.0),
                    Alignment::Center => (
                        frame.x + (frame.width - child_size.width) / 2.0,
                        frame.y + (frame.height - child_size.height) / 2.0
                    ),
                    Alignment::Trailing => (frame.right() - child_size.width, frame.y + (frame.height - child_size.height) / 2.0),
                    Alignment::BottomLeading => (frame.x, frame.bottom() - child_size.height),
                    Alignment::Bottom => (frame.x + (frame.width - child_size.width) / 2.0, frame.bottom() - child_size.height),
                    Alignment::BottomTrailing => (frame.right() - child_size.width, frame.bottom() - child_size.height),
                };
                
                let child_frame = Rect::new(x, y, child_size.width, child_size.height);
                
                self.position_node(child, child_frame);
            }
        }
    }
    
    fn position_scroll_children(&mut self, node: &RenderNode, frame: Rect) -> () {
        if !node.children.is_empty() {
            let child = &node.children[0];
            if let Some(child_layout) = self.layout_cache.get(&child.id) {
                let child_size = child_layout.content_size;
                
                let direction = node.resolved_props.get("direction")
                    .cloned()
                    .unwrap_or_else(|| "Vertical".to_string());
                
                let child_frame = if direction.contains("Horizontal") {
                    Rect::new(frame.x, frame.y, child_size.width, frame.height)
                } else {
                    Rect::new(frame.x, frame.y, frame.width, child_size.height)
                };
                
                self.position_node(child, child_frame);
            }
        }
    }
}