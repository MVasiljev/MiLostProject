
use crate::render::node::RenderNode;
use super::types::{Rect, Size, Alignment};
use std::collections::HashMap;

#[derive(Debug, Clone)]
pub struct LayoutInfo {
    pub frame: Rect,
    pub padding: Option<f32>,
    pub alignment: Option<Alignment>,
    pub content_size: Size,
}

impl LayoutInfo {
    pub fn new() -> Self {
        Self {
            frame: Rect::zero(),
            padding: None,
            alignment: None,
            content_size: Size::zero(),
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
    
    pub fn inner_rect(&self) -> Rect {
        if let Some(padding) = self.padding {
            self.frame.inset(padding)
        } else {
            self.frame
        }
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
    
    fn measure_spacer(&mut self, node: &RenderNode, _available_size: Size) -> Size {
        let size = node.resolved_props.get("size")
            .and_then(|val| val.parse::<f32>().ok())
            .unwrap_or(0.0);
        
        Size::new(size, size)
    }
    
    fn measure_divider(&mut self, node: &RenderNode, available_size: Size) -> Size {
        let thickness = node.resolved_props.get("thickness")
            .and_then(|val| val.parse::<f32>().ok())
            .unwrap_or(1.0);
        
        Size::new(available_size.width, thickness)
    }
    
    
    fn position_vstack_children(&mut self, node: &RenderNode, frame: Rect) -> () {
        let spacing = node.resolved_props.get("spacing")
            .and_then(|val| val.parse::<f32>().ok())
            .unwrap_or(0.0);
        
        let mut y_offset = frame.y;
        
        for child in &node.children {
            if let Some(child_layout) = self.layout_cache.get(&child.id) {
                let child_size = child_layout.content_size;
                
                let child_frame = Rect::new(
                    frame.x,
                    y_offset,
                    frame.width,
                    child_size.height
                );
                
                self.position_node(child, child_frame);
                
                y_offset += child_size.height + spacing;
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