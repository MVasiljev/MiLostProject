use std::collections::HashMap;
use crate::components::base_props_utils::extract_base_props;
use crate::render::node::RenderNode;
use crate::shared::properties::PropertyBag;
use crate::layout::types::{Rect, Size};
use crate::layout::layout_info::LayoutInfo;
use crate::render::property::Property;

use super::stack_layout::{measure_hstack, measure_vstack, position_hstack_children, position_vstack_children};
use super::zstack_layout::{measure_zstack, position_zstack_children};
use super::text_layout::measure_text;
use super::button_layout::measure_button;
use super::image_layout::measure_image;
use super::scroll_layout::{measure_scroll, position_scroll_children};
use super::spacer_layout::measure_spacer;
use super::divider_layout::measure_divider;

pub trait LayoutMeasurement {
    fn measure_node(&mut self, node: &RenderNode, available_size: Size) -> Size;
    fn get_layout_cache(&mut self) -> &mut HashMap<String, LayoutInfo>;
}

pub trait LayoutPositioning {
    fn position_node(&mut self, node: &RenderNode, frame: Rect);
    fn get_layout_cache(&mut self) -> &mut HashMap<String, LayoutInfo>;
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
        
        self.apply_base_layout_properties(node, &mut layout_info);
        
        self.layout_cache.insert(node.id.clone(), layout_info);
        
        content_size
    }

    fn apply_base_layout_properties(&self, node: &RenderNode, layout_info: &mut LayoutInfo) {
        let base_props = node.properties.get("base_props")
        .and_then(|prop| prop.as_map())
        .map(|map| {
            let string_map: HashMap<String, String> = map.iter()
                .map(|(k, v)| (k.clone(), v.to_string_value()))
                .collect();
            
            extract_base_props(&PropertyBag::from_string_map(&string_map))
        });
        
        if let Some(props) = base_props {
            if let Some(width) = props.width { layout_info.content_size.width = width; }
            if let Some(height) = props.height { layout_info.content_size.height = height; }
            
            if let Some(min_width) = props.min_width { layout_info.min_width = Some(min_width); }
            if let Some(max_width) = props.max_width { layout_info.max_width = Some(max_width); }
            if let Some(min_height) = props.min_height { layout_info.min_height = Some(min_height); }
            if let Some(max_height) = props.max_height { layout_info.max_height = Some(max_height); }
            
            if let Some(padding) = props.padding { layout_info.padding = Some(padding); }
            
            if let Some(edge_insets) = props.edge_insets {
                layout_info.content_size.width -= edge_insets.horizontal_insets();
                layout_info.content_size.height -= edge_insets.vertical_insets();
            }
        }
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
            node.properties.set("x", layout.frame.x);
            node.properties.set("y", layout.frame.y);
            node.properties.set("width", layout.frame.width);
            node.properties.set("height", layout.frame.height);
            
            for child in &mut node.children {
                self.apply_layout(child);
            }
        }
    }

    fn apply_layout_with_clipping(&self, node: &mut RenderNode) {
        if let Some(layout) = self.layout_cache.get(&node.id) {
            node.properties.set("x", layout.frame.x);
            node.properties.set("y", layout.frame.y);
            node.properties.set("width", layout.frame.width);
            node.properties.set("height", layout.frame.height);
            
            if let Some(Property::Boolean(true)) = node.properties.get("clip_to_bounds") {
                node.properties.set("clip_to_bounds", true);
            }
            
            for child in &mut node.children {
                self.apply_layout_with_clipping(child);
            }
        }
    }
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