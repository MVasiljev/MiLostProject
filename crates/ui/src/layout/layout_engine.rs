use std::collections::HashMap;
use crate::render::node::RenderNode;
use super::types::{Alignment, Rect, Size};
use super::layout_info::LayoutInfo;
use super::layout_utils::{parse_edge_insets, parse_edge_insets_from_string};

use super::stack_layout::{measure_hstack, measure_vstack, position_hstack_children, position_vstack_children};
use super::zstack_layout::{measure_zstack, position_zstack_children};
use super::text_layout::measure_text;
use super::button_layout::measure_button;
use super::image_layout::measure_image;
use super::scroll_layout::{measure_scroll, position_scroll_children};
use super::spacer_layout::measure_spacer;
use super::divider_layout::measure_divider;

pub struct LayoutEngine {
    layout_cache: HashMap<String, LayoutInfo>,
}

pub trait LayoutMeasurement {
    fn measure_node(&mut self, node: &RenderNode, available_size: Size) -> Size;
    fn get_layout_cache(&mut self) -> &mut HashMap<String, LayoutInfo>;
}

pub trait LayoutPositioning {
    fn position_node(&mut self, node: &RenderNode, frame: Rect);
    fn get_layout_cache(&mut self) -> &mut HashMap<String, LayoutInfo>;
}

impl LayoutMeasurement for LayoutEngine {
    fn measure_node(&mut self, node: &RenderNode, available_size: Size) -> Size {
        self.measure_node(node, available_size)
    }
    
    fn get_layout_cache(&mut self) -> &mut HashMap<String, LayoutInfo> {
        &mut self.layout_cache
    }
}

impl LayoutPositioning for LayoutEngine {
    fn position_node(&mut self, node: &RenderNode, frame: Rect) {
        self.position_node(node, frame)
    }
    
    fn get_layout_cache(&mut self) -> &mut HashMap<String, LayoutInfo> {
        &mut self.layout_cache
    }
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
    
    pub fn compute_enhanced_layout<'a>(&mut self, node: &'a mut RenderNode, container_size: Size) -> &'a mut RenderNode {
        self.layout_cache.clear();
        
        self.measure_node(node, container_size);
        
        self.position_node(node, Rect::from_size(container_size.width, container_size.height));
        
        self.apply_layout_with_clipping(node);
        
        node
    }
    
    fn measure_node(&mut self, node: &RenderNode, available_size: Size) -> Size {
        let node_type = &node.type_name;
        
        let content_size = match node_type.as_str() {
            "VStack" => measure_vstack(node, available_size, self),
            "HStack" => measure_hstack(node, available_size, self),
            "ZStack" => measure_zstack(node, available_size, self),
            "Text" => measure_text(node, available_size),
            "Button" => measure_button(node, available_size),
            "Image" => measure_image(node, available_size),
            "Scroll" => measure_scroll(node, available_size, self),
            "Spacer" => measure_spacer(node, available_size),
            "Divider" => measure_divider(node, available_size),
            _ => Size::zero(),
        };
        
        let mut layout_info = LayoutInfo::new().with_content_size(content_size);
        
        if let Some(padding) = node.get_prop("padding") {
            if let Ok(padding_value) = padding.parse::<f32>() {
                layout_info = layout_info.with_padding(padding_value);
            }
        }
        
        if let Some(alignment_str) = node.get_prop("alignment") {
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
        
        if let Some(flex_grow) = node.get_prop("flex_grow") {
            if let Ok(value) = flex_grow.parse::<f32>() {
                layout_info = layout_info.with_flex_grow(value);
            }
        }
        
        if let Some(flex_shrink) = node.get_prop("flex_shrink") {
            if let Ok(value) = flex_shrink.parse::<f32>() {
                layout_info = layout_info.with_flex_shrink(value);
            }
        }
        
        if let Some(flex_basis) = node.get_prop("flex_basis") {
            if let Ok(value) = flex_basis.parse::<f32>() {
                layout_info = layout_info.with_flex_basis(value);
            }
        }
        
        if let Some(min_width) = node.get_prop("min_width") {
            if let Ok(value) = min_width.parse::<f32>() {
                layout_info = layout_info.with_min_width(value);
            }
        }
        
        if let Some(max_width) = node.get_prop("max_width") {
            if let Ok(value) = max_width.parse::<f32>() {
                layout_info = layout_info.with_max_width(value);
            }
        }
        
        if let Some(min_height) = node.get_prop("min_height") {
            if let Ok(value) = min_height.parse::<f32>() {
                layout_info = layout_info.with_min_height(value);
            }
        }
        
        if let Some(max_height) = node.get_prop("max_height") {
            if let Ok(value) = max_height.parse::<f32>() {
                layout_info = layout_info.with_max_height(value);
            }
        }
        
        self.layout_cache.insert(node.id.clone(), layout_info);
        
        content_size
    }
    
    fn position_node(&mut self, node: &RenderNode, frame: Rect) {
        let inner_frame = {
            if let Some(layout_info) = self.layout_cache.get_mut(&node.id) {
                layout_info.frame = frame;
                
                if let Some(padding) = layout_info.padding {
                    frame.inset(padding)
                } else {
                    frame
                }
            } else {
                return;
            }
        };
        
        match node.type_name.as_str() {
            "VStack" => position_vstack_children(node, inner_frame, self),
            "HStack" => position_hstack_children(node, inner_frame, self),
            "ZStack" => position_zstack_children(node, inner_frame, self),
            "Scroll" => position_scroll_children(node, inner_frame, self),
            _ => (),
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
    
    fn apply_layout_with_clipping(&self, node: &mut RenderNode) {
        if let Some(layout) = self.layout_cache.get(&node.id) {
            node.resolved_props.insert("x".to_string(), layout.frame.x.to_string());
            node.resolved_props.insert("y".to_string(), layout.frame.y.to_string());
            node.resolved_props.insert("width".to_string(), layout.frame.width.to_string());
            node.resolved_props.insert("height".to_string(), layout.frame.height.to_string());
            
            if let Some(clip_to_bounds) = node.get_prop("clip_to_bounds") {
                if clip_to_bounds == "true" {
                    node.resolved_props.insert("clip_to_bounds".to_string(), "true".to_string());
                }
            }
            
            for child in &mut node.children {
                self.apply_layout_with_clipping(child);
            }
        }
    }
}
